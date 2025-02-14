import React from "react";
import styled from "@emotion/styled";
import { Typography, Popover, Button } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import dayjs from "dayjs";

type AppointmentProps = {
  appointment: Appointment;
  onRecommendAppointment: (appt: Appointment) => void;
};

export default function Appointment({ appointment, onRecommendAppointment }: AppointmentProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Wrapper onClick={(e) => handleClick(e)}>
        <Typography style={{color: "#000"}} >{appointment.customer_name}</Typography >
        <Typography style={{color: "#000"}} >{dayjs(appointment.appointmentTime).format("MM-DD-YYYY hh:mm A")}</Typography >
      </Wrapper>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Button onClick={() => onRecommendAppointment(appointment)}>
          <Typography>Recommend Schedule</Typography>
          <AutoAwesomeIcon />
        </Button>
      </Popover>
    </div>
  );
}

const Wrapper = styled.button`
  background-color: #fff;
  boder-radius: 4px;
  border: 1px solid lightgrey;
  cursor: pointer;
  width: 220px;
`;
