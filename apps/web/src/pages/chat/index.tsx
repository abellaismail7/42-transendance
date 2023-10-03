import { useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { socket } from "./globals";
import { ChatSpace } from "./_chat_space/ChatSpace";
import { Channel } from "./_dto/ChannelDto";
import { Channels } from "./_channels/Channels";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

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
              socket.emit("send_channel_message", {
                content,
                channelId,
                senderId: userId,
              });
            }}
          />
        </>
      ) : (
        <UserIdPrompt setUserId={setUserId} />
      )}
    </div>
  );
}
