import { useDisclosure, CircularProgress } from "@nextui-org/react";
import { PlusCircle } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import { useChannels, createChannel } from "./ChannelsRepository";
import { Channel } from "../_dto/ChannelDto";
import { CreateChannelModal } from "./_compoenents/CreateChannelModel";
import { ChannelItem } from "./_compoenents/ChannelItem";

type ChannelsProps = {
  onClick: (channel: Channel) => void;
  isSelected: (channel: Channel) => boolean;
  userId: string;
};

export function Channels({ onClick, isSelected, userId }: ChannelsProps) {
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: channels,
  } = useChannels(userId);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();

  const createChannelMuation = useMutation(createChannel, {
    onSuccess: () => queryClient.invalidateQueries("channels"),
  });

  return (
    <div className="flex items-center justify-center w-[500px]">
      {isLoading && <CircularProgress aria-label="Loading..." />}
      {isError && <p>{String(error)}</p>}
      {isSuccess && (
        <div className="flex h-full w-full flex-col gap-[24px]">
          <div className="flex items-center justify-between">
            <p className="text-[18px] font-bold">Channels</p>
            <PlusCircle onClick={onOpen} />
            <CreateChannelModal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              createChannel={(payload) => {
                createChannelMuation.mutate({
                  name: payload.name,
                  ownerId: userId,
                  image: "https://placehold.co/400",
                  access: payload.visibility,
                  password: payload.password,
                });
              }}
            />
          </div>
          <div className="flex flex-col w-full gap-[12px]">
            {channels.map((channel, index) => (
              <ChannelItem
                key={index}
                onClick={onClick}
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
