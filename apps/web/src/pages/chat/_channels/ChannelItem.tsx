import { Avatar, Chip } from "@nextui-org/react";
import { useEffect } from "react";
import { socket } from "../globals";
import { Channel } from "../_dto/ChannelDto";

export type ChannelItemProps = {
  channel: Channel;
  isSelected: boolean;
  onClick: (channel: Channel) => void;
};

export function ChannelItem({ channel, onClick, isSelected }: ChannelItemProps) {
  useEffect(() => {
    socket.emit("join_channel", channel.id);
    return () => {
      socket.emit("leave_channel", channel.id);
    };
  }, []);

  return (
    <div
      className={`flex flex-row w-full gap-[14px] p-[8px] items-center rounded-[8px] border-[1px] border-black ${
        isSelected ? "bg-blue-200" : "bg-transparent"
      }`}
      onClick={() => onClick(channel)}
    >
      <Avatar src={channel.image} size="lg" />
      <div className="flex flex-col flex-1">
        <p className="text-[16px] font-semibold line-clamp-1">{channel.name}</p>
        <p className="text-[14px] line-clamp-1">{channel.lastMessage}</p>
      </div>
      {channel.joinStatus === "WAIT_FOR_APPROVAL" && (
        <Chip className="text-[12px]" color="primary" variant="flat">
          Waiting for approval...
        </Chip>
      )}
    </div>
  );
}
