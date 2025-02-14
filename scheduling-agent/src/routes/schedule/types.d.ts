declare type SalesRep = {
  name: string;
  email: string;
  grade: string;
  availability: {
    startTime: string; // ISO 8601 date-time string
    endTime: string; // ISO 8601 date-time string
  }[];
};

declare type Appointment = {
  appointment_id: string;
  customer_name: string;
  address: string;
  lat: number;
  lng: number;
  appointmentTime: string; // ISO 8601 date-time string
};
