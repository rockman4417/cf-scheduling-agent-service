import axios from "axios";
import extractJson from "../../hooks/extractJSON";

const getAppointments = async (): Promise<Appointment[]> => {
  const endpoint = "http://localhost:3001/appointments";
  const res = await axios.get(endpoint);
  return res.data;
};

const getSalesReps = async (): Promise<SalesRep[]> => {
  const endpoint = "http://localhost:3001/sales-reps";
  const res = await axios.get(endpoint);
  return res.data;
};

const generatePrompt = async (prompt: string) => {
    const endpoint = "http://localhost:3001/generate";

    const res = await axios.post(endpoint, { prompt });
    // return res.data;
    const extractedRes = extractJson((res.data.response))?.extractedJson;

    return extractedRes;
};

const postSchedule = async (body: {rep_email: string, appointment_id: string}) => {
    const endpoint = "http://localhost:3001/schedule";

    const res = await axios.post(endpoint, body);

    return res.data;
};

export {
    getSalesReps,
    getAppointments,
    generatePrompt,
    postSchedule,
}
