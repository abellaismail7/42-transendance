import { Input } from "@nextui-org/react";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";

export type MessageInputProp = {
    onSend: (message: string) => void;
}

export function MessageInput({ onSend }: MessageInputProp) {
  const [message, setMessage] = useState("");

  return (
    <Input
      fullWidth={true}
      placeholder="Message"
      variant="bordered"
      color="primary"
      type="text"
      size="lg"
      value={message}
      onChange={(event) => {
        setMessage(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onSend(message);
          setMessage("");
        }
      }}
      endContent={
        <SendHorizonal
          onClick={() => {
            onSend(message);
            setMessage("");
          }}
        />
      }
    />
  );
}