import express, { Application, Request, Response } from "express";
import { WebSocketServer } from "ws";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Read JSON files
const readJsonFile = (filename: string): any => {
  const filePath = path.join(__dirname, filename);
  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

// API endpoints to serve JSON data
app.get("/appointments", (req, res) => {
  const appointments = readJsonFile("appointments.json");
  res.json(appointments);
});

app.get("/sales-reps", (req, res) => {
  const salesReps = readJsonFile("sales_reps.json");
  res.json(salesReps);
});

app.post("/schedule", (req, res) => {
  const { rep_email, appointment_id } = req.body;

  if (!rep_email) {
    res.status(400).json({ error: "rep_email is required." });
    return;
  }
  if (!appointment_id) {
    res.status(400).json({ error: "appointment_id is required." });
    return;
  }

  res.status(200).json({ message: "schedule success!" });
});

// Generate AI response with context
app.post("/generate", async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required." });
    return;
  }

  const fullContext = generateContext();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: fullContext }, // AI directive + scheduling data
        { role: "user", content: prompt },
      ],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

// Create WebSocket Server
const wss = new WebSocketServer({ port: 3002 });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  ws.on("message", async (message) => {
    try {
      const { prompt } = JSON.parse(message.toString());

      if (!prompt) {
        ws.send(JSON.stringify({ error: "Prompt is required." }));
        return;
      }

      const fullContext = generateContext();

      console.log("full context", fullContext);

      // Call OpenAI with streaming enabled
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: fullContext },
          { role: "user", content: prompt },
        ],
        stream: true,
      });

      // Stream response to the frontend
      for await (const chunk of stream) {
        ws.send(
          JSON.stringify({ chunk: chunk.choices[0]?.delta?.content || "" })
        );
      }

      // Indicate the end of the stream
      ws.send(JSON.stringify({ end: true }));
    } catch (error) {
      console.error("Error:", error);
      ws.send(JSON.stringify({ error: "Failed to process request." }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected from WebSocket");
  });
});

// Start HTTP server
app.listen(port, () => {
  console.log(`HTTP server running at http://localhost:${port}`);
  console.log(`WebSocket server running at ws://localhost:3002`);
});

const generateContext = () => {
  // Load AI directive
  const directive =
    readJsonFile("data.json").context || "You are a scheduling assistant.";

  // Load appointments and sales reps
  const appointments = readJsonFile("appointments.json");
  const salesReps = readJsonFile("sales_reps.json");

  // Format context
  const formattedAppointments = appointments
    .map(
      (appt: any) =>
        `Customer: ${appt.customerName}, Address: ${appt.address}, Time: ${appt.appointmentTime}`
    )
    .join("\n");

  const formattedSalesReps = salesReps
    .map(
      (rep: any) =>
        `Sales Rep: ${rep.name} (Grade: ${
          rep.grade
        }), Time Off: ${rep.availability
          .map((a: any) => `[${a.startTime} - ${a.endTime}]`)
          .join(", ")}`
    )
    .join("\n");

  const fullContext = `
  ${directive}
  Current Appointments:
  ${formattedAppointments}

  Sales Representatives & Availability:
  ${formattedSalesReps}
`;

  return fullContext;
};
