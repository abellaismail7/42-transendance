import { useMutation, useQuery, useQueryClient } from "react-query";
import { joinChannel, searchChannels } from "./ChannelsRepository";
import { SearchChannelItem } from "./SearchChannelItem";
import { useDebounce } from "use-debounce";
import { Search } from "lucide-react";
import { useState } from "react";

import {
  CircularProgress,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";

export type SearchChannelsModalProps = {
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
  userId: string;
};

export function SearchChannelsModal({
  isOpen,
  userId,
  onOpenChange,
}: SearchChannelsModalProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    isSuccess,
    data: channels,
  } = useQuery(["searchChannels", debouncedQuery], () =>
    searchChannels({ query: debouncedQuery, userId })
  );

  const joinMutation = useMutation(joinChannel, {
    onSuccess: () => {
      queryClient.invalidateQueries("searchChannels");
      queryClient.invalidateQueries("channels");
    },
  });

  function handleOpenChange(isOpen: boolean) {
    onOpenChange(isOpen);
    if (!isOpen) {
      setQuery("");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Search for channels
        </ModalHeader>
        <ModalBody>
          <Input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for channels..."
            startContent={<Search />}
            value={query}
          />
          <div className="flex flex-col items-center justify-center w-full min-h-[300px]">
            {isError && <p>An error occured while trying reching the server</p>}
            {isLoading && (
              <CircularProgress
                aria-label="Loading..."
                className="max-w-[10px] max-h-[10px]"
              />
            )}
            {isSuccess && channels.length > 0 && (
              <div className="flex flex-col gap-[8px] w-full flex-1">
                {channels.map((channel) => (
                  <SearchChannelItem
                    key={channel.id}
                    joinChannel={joinMutation.mutate}
                    channel={channel}
                    userId={userId}
                  />
                ))}
              </div>
            )}
            {isSuccess && channels.length == 0 && <p>No search result found</p>}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
