import { useState } from "react";
import styled from "@emotion/styled";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { useWebSocketChat } from "../hooks/useWebSocketChat";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

type ChatPopupProps = {
  open: boolean;
  onClose: () => void;
  chatInstance: ReturnType<typeof useWebSocketChat>;
  children?: React.ReactElement;
  isLoading?:boolean;
};

export default function ChatPopup({ open, onClose, chatInstance, children, isLoading, }: ChatPopupProps) {
  const [prompt, setPrompt] = useState("");
  const { response, prevResponses, loading, error, sendMessage } = chatInstance;

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(prompt);
    setPrompt(""); // Clear input after sending
  };

  return (
    <PopupContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: open ? 1 : 0, y: open ? 0 : 50 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0, y: 50 }}
      style={{ display: open ? "flex" : "none" }}
    >
      <Header>
        <Title>Chat Assistant</Title>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Header>
      <ChatBody>
        {!prevResponses.length && !response ? (
          <Greetings>
            Hello, I am the scheduling agent.
            <br /> I can answer scheduling-related questions for you.
            <br /> How can I help?
          </Greetings>
        ) : (
          <ResponseWrapper>
            {prevResponses.map((r, i) => (
              <ResponseBox key={i}>{r}</ResponseBox>
            ))}
            {response && <ResponseBox>{response}</ResponseBox>}
          </ResponseWrapper>
        )}
      </ChatBody>
      <ChatFooter onSubmit={onSend}>
        <ChatInput
          placeholder="Message the scheduling agent"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button type="submit" disabled={!prompt || loading}>
          {loading ? <CircularProgress size={20} /> : "Send"}
        </Button>
      </ChatFooter>
      {!loading && !isLoading && <div style={{ padding: 10 }}>{children}</div>}
      {error && <ErrorText>{error}</ErrorText>}
    </PopupContainer>
  );
}


const PopupContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 300px;
  background: #222;
  color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #333;
  border-bottom: 1px solid #444;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  max-height: 300px;
`;

const Greetings = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 14px;
`;

const ResponseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ResponseBox = styled.div`
  background: #444;
  padding: 8px;
  border-radius: 5px;
  font-size: 14px;
`;

const ChatFooter = styled.form`
  display: flex;
  padding: 10px;
  background: #333;
  border-top: 1px solid #444;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  background: #555;
  color: white;
  border-radius: 5px;
  margin-right: 8px;

  &:focus {
    outline: none;
  }
`;

const ErrorText = styled.div`
  color: red;
  font-size: 12px;
  padding: 5px;
  text-align: center;
`;
