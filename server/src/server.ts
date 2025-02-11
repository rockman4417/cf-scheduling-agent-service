import express, { Application, Request, Response } from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app: Application = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// Generate AI response with context
app.post("/generate", async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required." });
    return;
  }

  // Load AI directive from data.json
  const directive =
    readJsonFile("data.json").context || "You are a scheduling assistant.";

  // Load appointments and sales reps
  const appointments = readJsonFile("appointments.json");
  const salesReps = readJsonFile("sales_reps.json");

  // Format appointments as context
  const formattedAppointments = appointments
    .map(
      (appt: any) =>
        `Customer: ${appt.customerName}, Address: ${appt.address}, Time: ${appt.appointmentTime}`
    )
    .join("\n");

  // Format sales reps and their availability
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

  // Combine all context
  const fullContext = `
      ${directive}
      Current Appointments:
      ${formattedAppointments}
  
      Sales Representatives & Availability:
      ${formattedSalesReps}
    `;

  console.log("full context", fullContext)

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
