import { useRef, useEffect } from "react";
import { MessageDto } from "./ChannelMessagesRepository";

export type MessagesBoxProps = {
  messages: MessageDto[];
  userId: string;
};

export function MessagesBox({ messages, userId }: MessagesBoxProps) {
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBoxRef.current?.lastElementChild?.scrollIntoView();
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 overflow-y-scroll">
      <div className="flex-1"></div>
      <div ref={chatBoxRef} className="flex flex-col gap-[8px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col w-full ${
              message.senderId === userId ? "items-end" : "items-start"
            }`}
          >
            {message.senderId !== userId && (
              <p className="text-[12px]">@{message.sender.login}</p>
            )}
            <div className="min-w-[150px] max-w-[500px] px-[8px] py-[4px] text-[18px] border-black border-[1px] rounded-[8px]">
              <p className="break-words">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
