import { useDebounce } from "use-debounce";
import { Search } from "lucide-react";
import { useState } from "react";

import {
  Avatar,
  Button,
  CircularProgress,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";

import { useQuery } from "react-query";
import { api } from "../globals";
import { z } from "zod";

export type SearchChannelsModalProps = {
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  isOpen: boolean;
  userId: string;
};

const SearchChannelScheme = z.array(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    ownerId: z.string().uuid(),
    image: z.string().url(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    access: z.union([
      z.literal("PROTECTED"),
      z.literal("PRIVATE"),
      z.literal("PUBLIC"),
    ]),
  })
);

export function SearchChannelsModal({
  isOpen,
  userId,
  onClose,
  onOpenChange,
}: SearchChannelsModalProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  const {
    isLoading,
    isError,
    isSuccess,
    data: channels,
  } = useQuery(["searchChannels", debouncedQuery], async () => {
    const { data } = await api.get("/channels/search", {
      params: { q: debouncedQuery, userId },
    });
    return SearchChannelScheme.parse(data);
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
              <div className="w-full flex-1">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex flex-row w-full gap-[8px] p-[8px] items-center rounded-[8px] border-[1px] border-black"
                  >
                    <Avatar src={channel.image} size="md" />
                    <div className="flex flex-col flex-1 overflow-auto">
                      <p>
                        {channel.name}{" "}
                        {channel.access === "PROTECTED" && (
                          <span className="bg-red-100 font-bold rounded text-[12px] p-[4px]">
                            protected
                          </span>
                        )}
                      </p>
                    </div>
                    <Button size="sm" color="primary">
                      Join
                    </Button>
                  </div>
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
