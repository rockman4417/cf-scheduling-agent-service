import { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Button, CircularProgress } from "@mui/material";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string>("");
  const [prevResponses, setPrevResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const tempResponseRef = useRef<string>("");

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3002");

    wsRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data", data);

      if (data.chunk) {
        // Append streamed text to the temporary response
        tempResponseRef.current += data.chunk;
        setResponse((prev) => prev + data.chunk); // Append streamed text
      } else if (data.end) {
        setLoading(false);
        console.log("temp response current", tempResponseRef.current);

        // Capture the value before resetting tempResponseRef.current
        const finalResponse = tempResponseRef.current;
        tempResponseRef.current = ""; // Reset after capturing
        setResponse("");

        // Ensure we add the captured value
        setPrevResponses((prev) => [...prev, finalResponse]);
      } else if (data.error) {
        setError(data.error);
        setLoading(false);
      }
    };

    wsRef.current.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError("WebSocket connection error.");
      setLoading(false);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    console.log("prev responses", prevResponses)
  }, [prevResponses]);


  const onSend = (e: any) => {
    e.preventDefault();
    if (!prompt.trim() || !wsRef.current) return;

    setResponse("");
    setError(null);
    setLoading(true);

    wsRef.current.send(JSON.stringify({ prompt }));
  };

  return (
    <Wrapper onSubmit={onSend}>
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
          {response && <ResponseBox style={{borderTop: "1px solid #fff"}}>{response}</ResponseBox>}
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