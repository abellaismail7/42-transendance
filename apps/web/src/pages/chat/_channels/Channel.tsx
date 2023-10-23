import { useSocket } from "~/pages/SocketContext";
import { Avatar } from "@nextui-org/react";
import { ChannelDto } from "./ChannelDto";
import { useEffect } from "react";

export type ChannelProps = {
  channel: ChannelDto;
  isSelected: boolean;
  onClick: (channel: ChannelDto) => void;
};

export function Channel({ channel, onClick, isSelected }: ChannelProps) {
  const socket = useSocket();

  useEffect(() => {
    socket.emit("join_channel", channel.id);
    return () => {
      socket.emit("leave_channel", channel.id);
    };
  }, []);

  return (
    <div
      className={`flex flex-row w-full gap-[8px] p-[8px] items-center rounded-[8px] border-[1px] border-black ${
        isSelected ? "bg-blue-200" : "bg-transparent"
      }`}
      onClick={() => onClick(channel)}
    >
      <Avatar src={channel.image} size="lg" />
      <div className="flex flex-col flex-1 overflow-auto">
        <p className="text-[16px] font-semibold line-clamp-1">{channel.name}</p>
        <p className="text-[14px] w-full line-clamp-1 text-ellipsis">
          {channel.lastMessage}
        </p>
      </div>
    </div>
  );
}
