import { useDisclosure, CircularProgress } from "@nextui-org/react";
import { PlusCircle } from "lucide-react";
import { useChannels } from "./ChannelsRepository";
import { ChannelDto } from "./ChannelDto";
import { CreateChannelModal } from "./CreateChannelModel";
import { Channel } from "./Channel";

export type ChannelsProps = {
  onChannelSelected: (channel: ChannelDto) => void;
  isSelected: (channel: ChannelDto) => boolean;
  userId: string;
};

export function Channels({
  onChannelSelected,
  isSelected,
  userId,
}: ChannelsProps) {
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: channels,
  } = useChannels(userId);

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <div className="flex items-center justify-center w-[350px]">
      {isLoading && <CircularProgress aria-label="Loading..." />}
      {isError && <p>{String(error)}</p>}
      {isSuccess && (
        <div className="flex h-full w-full flex-col gap-[24px]">
          <div className="flex items-center justify-between">
            <p className="text-[18px] font-bold">Channels</p>
            <PlusCircle onClick={onOpen} />
            <CreateChannelModal
              onOpenChange={onOpenChange}
              onClose={onClose}
              isOpen={isOpen}
              userId={userId}
            />
          </div>
          <div className="flex flex-col w-full gap-[12px] overflow-y-scroll">
            {channels.map((channel, index) => (
              <Channel
                key={index}
                onClick={onChannelSelected}
                channel={channel}
                isSelected={isSelected(channel)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
