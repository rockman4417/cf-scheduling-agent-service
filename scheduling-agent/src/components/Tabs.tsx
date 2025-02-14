import React from "react";
import { Button, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

export default function Tabs() {
  const navigate = useNavigate();

  const onClick = (route: string) => {
    navigate(route);
  };

  return (
    <Wrapper>
      <Button onClick={() => onClick("/")}>
        <Typography>Chat</Typography>
      </Button>
      <Button onClick={() => onClick("/schedule")}>
        <Typography>Schedule</Typography>
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  position: absolute;
  top: 0;
  left: 50%;
`;
