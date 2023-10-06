import { useDisclosure, CircularProgress } from "@nextui-org/react";
import { SearchChannelsModal } from "./SearchChannelsModal";
import { CreateChannelModal } from "./CreateChannelModal";
import { PlusCircle, Search } from "lucide-react";
import { useChannels } from "./ChannelsRepository";
import { ChannelDto } from "./ChannelDto";
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
  const { isLoading, isError, isSuccess, data: channels } = useChannels(userId);

  const createModal = useDisclosure();
  const searchModal = useDisclosure();

  return (
    <div className="flex h-full w-[350px] items-center justify-center">
      {isLoading && <CircularProgress aria-label="Loading..." />}
      {isError && <p>An error occured while trying reching the server</p>}
      {isSuccess && (
        <div className="flex h-full w-full flex-col gap-[24px]">
          <div className="flex items-center justify-between">
            <p className="text-[18px] font-bold">Channels</p>
            <div className="flex gap-[16px]">
              <Search onClick={searchModal.onOpen} />
              <SearchChannelsModal
                onOpenChange={searchModal.onOpenChange}
                isOpen={searchModal.isOpen}
                userId={userId}
              />
              <PlusCircle onClick={createModal.onOpen} />
              <CreateChannelModal
                onOpenChange={createModal.onOpenChange}
                onClose={createModal.onClose}
                isOpen={createModal.isOpen}
                userId={userId}
              />
            </div>
          </div>
          <div className="flex flex-col h-full w-full gap-[12px] overflow-y-scroll">
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
