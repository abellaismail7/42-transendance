import { MoreVertical, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useChannelMessages } from "./ChannelMessagesRepository";
import { MessageInput } from "./MessageInput";
import { MessagesBox } from "./MessagesBox";
import { useDebounce } from "use-debounce";
import { ChannelDto } from "../_channels/ChannelDto";
import { api, socket } from "../globals";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";

import {
  Button,
  CircularProgress,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

type InvitationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
};

const SearchUsersScheme = z.array(
  z.object({
    id: z.string().uuid(),
    username: z.string(),
    login: z.string(),
    email: z.string(),
    image: z.string().url(),
  })
);

type SearchUser = z.infer<typeof SearchUsersScheme>[number];

type SearchUserItemProps = {
  invite: (userId: string) => void;
  user: SearchUser;
};

function SearchUserItem({ user, invite }: SearchUserItemProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <p>
        {user.username}
        {" - @" + user.login}
      </p>
      <Button size="sm" onClick={() => invite(user.id)}>
        Invite
      </Button>
    </div>
  );
}

function InvitationModal({ isOpen, onClose, channelId }: InvitationModalProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isLoading,
    data: users,
  } = useQuery(["searchUsers", debouncedQuery], async () => {
    const { data } = await api.get("/channels/search_to_invite", {
      params: { q: debouncedQuery, channelId },
    });
    return SearchUsersScheme.parse(data);
  });

  const inviteMutation = useMutation(
    (userId: string) => {
      return api.post("/channels/invite", {
        channelId: channelId,
        receiverId: userId,
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("searchUsers"),
    }
  );

  return (
    <Modal isOpen={isOpen} closeButton={undefined} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Invite people</ModalHeader>
        <ModalBody>
          <Input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for users..."
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
            {isSuccess && users.length > 0 && (
              <div className="flex flex-col gap-[8px] w-full flex-1">
                {users.map((user) => (
                  <SearchUserItem
                    key={user.id}
                    user={user}
                    invite={inviteMutation.mutate}
                  />
                ))}
              </div>
            )}
            {isSuccess && users.length == 0 && <p>No search result found</p>}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export type MessagesProps = {
  userId: string;
  channel: ChannelDto;
};

export function Messages({ userId, channel }: MessagesProps) {
  const {
    isError,
    isSuccess,
    isLoading,
    data: messages,
  } = useChannelMessages(userId, channel.id);

  useEffect(() => {
    socket.emit("join_channel", channel.id);
    return () => {
      socket.emit("leave_channel", channel.id);
    };
  }, []);

  const inviteModel = useDisclosure();

  return (
    <div className="flex h-full justify-center items-center flex-1">
      {isLoading && <CircularProgress aria-label="Loading..." />}
      {isError && <p>An error occured while trying reching the server</p>}
      {isSuccess && (
        <div className="flex h-full flex-col flex-1 gap-[18px]">
          <div className="flex flex-row items-center justify-between">
            <p className="flex-1 font-bold text-ellipsis line-clamp-1 text-[20px]">
              {channel.name}
            </p>
            <Dropdown>
              <DropdownTrigger>
                <MoreVertical />
              </DropdownTrigger>
              <DropdownMenu aria-label="Channel options">
                <DropdownItem onClick={inviteModel.onOpen}>Invite</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <InvitationModal
              isOpen={inviteModel.isOpen}
              onClose={inviteModel.onClose}
              channelId={channel.id}
            />
          </div>
          <MessagesBox userId={userId} messages={messages} />
          <MessageInput
            onSend={(message) => {
              socket.emit("send_channel_message", {
                channelId: channel.id,
                senderId: userId,
                content: message,
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
