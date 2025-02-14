import { useState } from "react";
import styled from "@emotion/styled";
import { Button, CircularProgress } from "@mui/material";
import Tabs from "../components/Tabs";
import { useWebSocketChat } from "../hooks/useWebSocketChat";

export default function Chat() {
  const [prompt, setPrompt] = useState("");

  const { response, prevResponses, loading, error, sendMessage } =
    useWebSocketChat("ws://localhost:3002");

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(prompt);
    setPrompt(""); // Clear input after sending
  };

  return (
    <Wrapper onSubmit={onSend}>
      <Tabs />
      {!prevResponses.length && !response ? (
        <Greetings>
          Hello, I am the scheduling agent,
          <br /> I can answer scheduling related questions for you.
          <br /> How can I help?
        </Greetings>
      ) : (
        <ResponseWrapper>
          {prevResponses.map((r, i) => (
            <ResponseBox
              style={{
                borderBottom:
                  i === prevResponses.length - 1 ? "none" : "1px solid #fff",
              }}
              key={i}
            >
              {r}
            </ResponseBox>
          ))}
          {response && (
            <ResponseBox style={{ borderTop: "1px solid #fff" }}>
              {response}
            </ResponseBox>
          )}
        </ResponseWrapper>
      )}
      <InputWrapper>
        <StyledInput
          placeholder="Message the scheduling agent"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </InputWrapper>
      <Button type="submit" disabled={!prompt || loading}>
        {loading ? <CircularProgress size={20} /> : "Send"}
      </Button>

      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 80vw;
  padding: 20px;
`;

const ResponseBox = styled.div`
  background: none;
  padding: 10px;
  text-align: left;
  font-size: 16px;
  width: 100%;
  color: #fff;
  min-height: 50px;
  white-space: pre-wrap;
`;

const Greetings = styled.div`
  color: #fff;
  font-size: 22px;
  text-align: center;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 14px;
`;

const InputWrapper = styled.div`
  background-color: #383838;
  border-radius: 8px;
  padding: 10px;
  border: none;
  font-size: 16px;
  min-height: 100px;
  width: 60%;
  input.middle:focus {
    outline-width: 0;
  }
`;

const StyledInput = styled.input`
  background: none;
  border: none;
  font-size: 16px;
  width: 100%;
`;

const ResponseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  overflow: none;
  gap: 10px;
`;