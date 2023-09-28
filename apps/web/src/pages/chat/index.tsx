import { SendHorizonal } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { z } from "zod";

import io, { Socket } from "socket.io-client";
import axios from "axios";

import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

const api = axios.create({ baseURL: "http://localhost:4000" });

// const HARDCODED_UID = "c7a2856a-f8a2-4dfb-a63d-04a6c962e22e";
//                       "9bd47551-6936-448b-98a7-9456e7a83718";

const ChannelsScheme = z.array(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    image: z.string().url(),
    lastMessage: z.string().nullable(),
    joinStatus: z.union([z.literal("WAIT_FOR_APPROVAL"), z.literal("JOINED")]),
  })
);

type Channel = z.infer<typeof ChannelsScheme>[number];

function useChannels(userId: string) {
  return useQuery("channels", async () => {
    const { data } = await api.get(`/channels/user/${userId}`);
    return ChannelsScheme.parse(data);
  });
}

const MessageScheme = z.array(
  z.object({
    id: z.string().uuid(),
    senderId: z.string().uuid(),
    channelId: z.string().uuid(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    content: z.string(),
  })
);

function useChannelMessages(userId: string, channelId: string) {
  return useQuery(["messages", channelId], async () => {
    const { data } = await api.get("/channels/messages", {
      params: { userId, channelId },
    });
    return MessageScheme.parse(data);
  });
}

type ChannelItemProps = {
  channel: Channel;
  isSelected: boolean;
  onClick: (channel: Channel) => void;
};

function ChannelItem({ channel, onClick, isSelected }: ChannelItemProps) {
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

type ChannelsProps = {
  onClick: (channel: Channel) => void;
  isSelected: (channel: Channel) => boolean;
  userId: string;
};

function Channels({ onClick, isSelected, userId }: ChannelsProps) {
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: channels,
  } = useChannels(userId);

  return (
    <div className="flex items-center justify-center w-[500px]">
      {isLoading && <CircularProgress aria-label="Loading..." />}
      {isError && <p>{String(error)}</p>}
      {isSuccess && (
        <div className="flex h-full w-full flex-col gap-[24px]">
          <p className="text-[18px] font-bold">Channels</p>
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

type ChatSpaceProps = {
  channel: Channel | null;
  userId: string;
  onSend: (channelId: string, message: string) => void;
};

function ChatSpace({ channel, userId, onSend }: ChatSpaceProps) {
  if (channel === null) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>To start chatting, select one of the channels.</p>
      </div>
    );
  }

  if (channel.joinStatus === "WAIT_FOR_APPROVAL") {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>You are not approved yet to join this channels.</p>
      </div>
    );
  }

  const [message, setMessage] = useState("");

  const {
    isError,
    error,
    isSuccess,
    data: messages,
  } = useChannelMessages(userId, channel.id);

  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:4000", { transports: ["websocket"] });
    socket.on("connect", () => {
      socket.on("messages", () => {
        queryClient.invalidateQueries("messages");
        queryClient.invalidateQueries("channels");
      });
    });
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="flex flex-col w-full gap-[18px]">
      <p className="text-[20px] font-bold">{channel.name}</p>
      <div className="flex flex-col flex-1 overflow-y-scroll">
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
      <Input
        fullWidth={true}
        placeholder="Message"
        variant="bordered"
        color="primary"
        type="text"
        size="lg"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && message.trim().length > 0) {
            onSend(channel.id, message);
            socket?.emit("messages");
            setMessage("");
          }
        }}
        endContent={<SendHorizonal onClick={() => {}} />}
      />
    </div>
  );
}

type PostMessageProps = {
  channelId: string;
  senderId: string;
  content: string;
};

function postMessage(messagePayload: PostMessageProps) {
  return api.post("/channels/messages", messagePayload);
}

function UserIdPrompt({ setUserId }: { setUserId: (userId: string) => void }) {
  const [inputUserId, setInputUserId] = useState("");

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Modal isOpen={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Login</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  placeholder="Enter your user id"
                  variant="bordered"
                  onChange={(event) => setInputUserId(event.target.value)}
                  value={inputUserId}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => {
                    setUserId(inputUserId);
                    onClose();
                  }}
                >
                  Login
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <p>You have to provide you user id</p>
    </div>
  );
}

export default function Chat() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const sendMessage = useMutation(postMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries("messages");
      queryClient.invalidateQueries("channels");
    },
  });

  return (
    <div className="flex w-fill gap-[24px] p-[24px] h-[100dvh]">
      {userId !== null ? (
        <>
          <Channels
            onClick={(channel) => setSelectedChannel(channel)}
            isSelected={(channel) => selectedChannel?.id === channel.id}
            userId={userId}
          />
          <ChatSpace
            channel={selectedChannel}
            userId={userId}
            onSend={(channelId, content) => {
              sendMessage.mutate({ content, channelId, senderId: userId });
            }}
          />
        </>
      ) : (
        <UserIdPrompt setUserId={setUserId} />
      )}
    </div>
  );
}
