import { useEffect, useRef } from "react";
import { socket } from "../globals";
import { Channel } from "../_dto/ChannelDto";
import { useChannelMessages } from "./ChannelMessagesRepository";
import { MessageInput } from "./MessageInput";

export type MessagesProps = {
  userId: string;
  channel: Channel;
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
    if (isSuccess && chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.offsetTop + chatBoxRef.current.offsetHeight,
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full gap-[18px]">
      <p className="text-[20px] font-bold">{channel.name}</p>
      <div ref={chatBoxRef} className="flex flex-col flex-1 overflow-y-scroll">
        <div className="flex-1"></div>
        {isError && <p>{String(error)}</p>}
        {isSuccess && (
          <div className="w-full">
            {messages.map((message, index) => (
              <p key={index} className="text-[18px]">
                {message.content}
              </p>
            ))}
          </div>
        )}
      </div>
      <MessageInput onSend={(message) => {
        onSend(channel.id, message);
      }}/>
    </div>
  );
}
