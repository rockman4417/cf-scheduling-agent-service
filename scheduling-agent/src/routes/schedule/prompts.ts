const generateAppointmentPrompt = (appointment: Appointment) => {
  const prompt = `Give me the optimal sales rep for this appointment ${JSON.stringify(
    appointment
  )}`;

  return prompt;
};

const generateRepPrompt = (rep: SalesRep) => {
  const prompt = `Give me the optimal next appointment for this sales rep ${JSON.stringify(
    rep
  )}`;

  return prompt;
};

const extractAppointmentAndRepIdPrompt = (initial_prompt: string, response: string) => {
    const prompt = `Find the match for the recommended rep_email and appointment_id from the data pertaining to this message and give me them back in JSON format.  The structure of the JSON object should look like {rep_email, appointment_id} Prompt: ${initial_prompt}, Response: ${response}`;

    return prompt;
};

export {
  generateAppointmentPrompt,
  generateRepPrompt,
  extractAppointmentAndRepIdPrompt,
};
