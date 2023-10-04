import { useEffect, useRef } from "react";
import { socket } from "../globals";
import { ChannelDto } from "../_channels/ChannelDto";
import { useChannelMessages } from "./ChannelMessagesRepository";
import { MessageInput } from "./MessageInput";

export type MessagesProps = {
  userId: string;
  channel: ChannelDto;
  onSend: (channelId: string, message: string) => void;
};

export function Messages({ userId, channel, onSend }: MessagesProps) {
  const {
    isError,
    error,
    isSuccess,
    data: messages,
  } = useChannelMessages(userId, channel.id);

  useEffect(() => {
    socket.emit("join_channel", channel.id);
    return () => {
      socket.emit("leave_channel", channel.id);
    };
  }, []);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSuccess) {
      chatBoxRef.current?.lastElementChild?.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 gap-[18px]">
      <p className="text-[20px] font-bold">{channel.name}</p>
      <div className="flex flex-col flex-1 overflow-y-scroll">
        <div className="flex-1"></div>
        {isError && <p>{String(error)}</p>}
        {isSuccess && (
          <div ref={chatBoxRef} className="w-full">
            {messages.map((message, index) => (
              <p key={index} className="text-[18px]">
                {message.content}
              </p>
            ))}
          </div>
        )}
      </div>
      <MessageInput
        onSend={(message) => {
          onSend(channel.id, message);
        }}
      />
    </div>
  );
}
