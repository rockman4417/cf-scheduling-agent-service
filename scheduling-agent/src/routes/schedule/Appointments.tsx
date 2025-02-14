import React from "react";
import styled from "@emotion/styled";
import { getAppointments } from "./api";
import { useQuery } from "@tanstack/react-query";
import Appointment from "./Appointment";
import { Skeleton, Typography } from "@mui/material";

type AppointmentsProps = {
    onRecommendAppointment: (appt: Appointment) => void;
};

export default function Appointments({
  onRecommendAppointment,
}: AppointmentsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  return (
    <Wrapper>
      <Typography>Appointments</Typography>
      <ApptsWrapper>
        {isLoading
            ? Array(5).map((v, i) => <Skeleton key={i} />)
            : data?.map((appt, i) => (
                <Appointment
                key={i}
                onRecommendAppointment={onRecommendAppointment}
                appointment={appt}
                />
            ))}
      </ApptsWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
`;

const ApptsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #fff;
  border-radius: 4px;
`;
