import { useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { api, socket } from "./globals";
import { ChatSpace } from "./_chat_space/ChatSpace";
import { Channel } from "./_dto/ChannelDto";
import { Channels } from "./_channels/Channels";
import { z } from "zod";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

const MemberScheme = z.array(
  z.object({
    isAdmin: z.boolean(),
    isMuted: z.boolean(),
    muteDuration: z.number().nullable(),
    user: z.object({
      id: z.string().uuid(),
      username: z.string(),
      login: z.string(),
      state: z.union([
        z.literal("DO_NOT_DISTURB"),
        z.literal("IN_MATCH"),
        z.literal("OFFLINE"),
        z.literal("ONLINE"),
      ]),
    }),
  })
);

// TODO(saidooubella): To be deleted once authentication is ready for integration.
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
    </div>
  );
}

type ChannelMembersProps = {
  channel: Channel;
};

function ChannelMembers({ channel }: ChannelMembersProps) {
  const { isSuccess, data: members } = useQuery({
    queryKey: ["members", channel.id],
    queryFn: async () => {
      const { data } = await api.get(`/channels/members/${channel.id}`);
      return MemberScheme.parse(data);
    },
  });

  return (
    <div className="flex h-full w-[500px] flex-col gap-[24px]">
      <p className="text-[18px] font-bold">Memebers</p>
      {isSuccess && (
        <div className="flex flex-col w-full gap-[12px]">
          {members.map((member) => (
            <div className="flex flex-row w-full gap-[14px] p-[8px] items-center rounded-[8px] border-[1px] border-black">
              <div className="flex flex-col flex-1">
                <p className="text-[16px] font-semibold line-clamp-1">
                  {member.user.username}
                </p>
                <p className="text-[14px] line-clamp-1">{member.user.login}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Chat() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const callback = () => {
      queryClient.invalidateQueries("messages");
      queryClient.invalidateQueries("channels");
    };
    socket.on("reload_messages", callback);
    return () => {
      socket.off("reload_messages", callback);
    };
  }, []);

  return (
    <div className="flex h-[100dvh] w-fill p-[24px] gap-[24px]">
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
              socket.emit("send_channel_message", {
                content,
                channelId,
                senderId: userId,
              });
            }}
          />
          {selectedChannel && <ChannelMembers channel={selectedChannel} />}
        </>
      ) : (
        <UserIdPrompt setUserId={setUserId} />
      )}
    </div>
  );
}
