import { useChannelMessages } from "./ChannelMessagesRepository";
import { CircularProgress } from "@nextui-org/react";
import { ChannelDto } from "../_channels/ChannelDto";
import { MessageInput } from "./MessageInput";
import { useEffect, useRef } from "react";
import { socket } from "../globals";

export type MessagesProps = {
  userId: string;
  channel: ChannelDto;
  onSend: (channelId: string, message: string) => void;
};

export function Messages({ userId, channel, onSend }: MessagesProps) {
  const {
    isError,
    isSuccess,
    isLoading,
    data: messages,
  } = useChannelMessages(userId, channel.id);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit("join_channel", channel.id);
    return () => {
      socket.emit("leave_channel", channel.id);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      chatBoxRef.current?.lastElementChild?.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className="flex justify-center flex-1">
      {isLoading && <CircularProgress aria-label="Loading..." />}
      {isError && <p>An error occured while trying reching the server</p>}
      {isSuccess && (
        <div className="flex flex-col flex-1 gap-[18px]">
          <p className="text-[20px] font-bold">{channel.name}</p>
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
          <MessageInput onSend={(message) => onSend(channel.id, message)} />
        </div>
      )}
    </div>
  );
}
