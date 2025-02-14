import React, { useEffect } from 'react';
import styled from "@emotion/styled";
import Tabs from '../../components/Tabs';
import Appointments from './Appointments';
import SalesReps from './SalesReps';
import { useWebSocketChat } from '../../hooks';
import { ChatPopup } from '../../components';
import { generateAppointmentPrompt, generateRepPrompt, extractAppointmentAndRepIdPrompt } from './prompts';
import { useMutation } from '@tanstack/react-query';
import { generatePrompt, postSchedule } from './api';
import { Button, Typography } from '@mui/material';


export default function Schedule() {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [responseData, setResponseData] = React.useState();
  const chatInstance = useWebSocketChat("ws://localhost:3002");
  const { response, prevResponses, loading, error, sendMessage } = chatInstance;

  const { mutateAsync: extractDataMutate } = useMutation({
    mutationFn: generatePrompt,
  });
  const { mutate: scheduleMutate } = useMutation({
    mutationFn: postSchedule,
    onSuccess: (res) => {
      window.alert(res.message);
    },
  });

  useEffect(() => {
    responseData && console.log("response data", responseData);
  },[responseData])

  const onRecommendRep = (rep: SalesRep) => {
    const message = generateRepPrompt(rep);
    sendMessage(message).then((res) => {
      const extractPrompt = extractAppointmentAndRepIdPrompt(
        JSON.stringify(rep),
        res
      );
      extractDataMutate(extractPrompt).then((res) => {
        setResponseData(res);
      });
    });
    setIsChatOpen(true);
  };

  const onRecommendAppointment = (appointment: Appointment) => {
    const message = generateAppointmentPrompt(appointment);
    sendMessage(message).then((res) => {
      const extractPrompt = extractAppointmentAndRepIdPrompt(
        JSON.stringify(appointment),
        res
      );
      extractDataMutate(extractPrompt).then((res) => {
        setResponseData(res);
      });
    });
    setIsChatOpen(true);
  };

  const onScheduleNow = () => {
    const body = {
      //@ts-ignore
      rep_email: responseData?.rep_email,
      //@ts-ignore
      appointment_id: responseData?.appointment_id,
    };
    scheduleMutate(body);
  };

  return (
    <Wrapper>
      <Tabs />
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "80%",
          justifyContent: "center",
          alignItems: "center",
          gap: 100
        }}
      >
        <SalesReps onRecommendRep={onRecommendRep} />
        <Appointments onRecommendAppointment={onRecommendAppointment} />
      </div>
      <ChatPopup
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        chatInstance={chatInstance}
      >
        {responseData && (
          <Button onClick={onScheduleNow}>
            <Typography>Schedule Now</Typography>
          </Button>
        )}
      </ChatPopup>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 80vw;
  height: 80vh;
  padding: 20px;
`;
