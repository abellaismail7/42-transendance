import { ChannelMembers } from "./_channel_members/ChannelMembers";
import { ChannelMemberDto } from "./_channel_members/ChannelMemberDto";
import { ChatSpace } from "./_chat_space/ChatSpace";
import { ChannelDto } from "./_channels/ChannelDto";
import { SideNavigation } from "./_channels/Channels";
import { useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { socket } from "./globals";
import { X } from "lucide-react";

import {
  Avatar,
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

type ChannelMemberDetailsProps = {
  member: ChannelMemberDto;
  onClose: () => void;
};

function ChannelMemberDetails({ member, onClose }: ChannelMemberDetailsProps) {
  return (
    <div className="flex h-full w-[350px] flex-col gap-[24px]">
      <div className="flex items-center justify-end">
        <X onClick={onClose} />
      </div>
      <div className="flex flex-col items-center">
        <Avatar
          className="w-[150px] h-[150px]"
          src={member.user.image}
          size="lg"
        />
        <p className="text-[20px] pt-[16px]">
          {member.user.username}
          {member.isAdmin && (
            <span className="p-[4px] font-bold text-[12px] rounded-[6px] bg-red-100">
              admin
            </span>
          )}
        </p>
        <p>@{member.user.login}</p>
      </div>
    </div>
  );
}

export default function Chat() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelDto | null>(
    null
  );
  const [selectedMember, setSelectedMember] = useState<ChannelMemberDto | null>(
    null
  );
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
          <SideNavigation
            onChannelSelected={(channel) => {
              if (selectedChannel?.id !== channel.id) {
                setSelectedChannel(channel);
                setSelectedMember(null);
              }
            }}
            isSelected={(channel) => selectedChannel?.id === channel.id}
            userId={userId}
          />
          <ChatSpace channel={selectedChannel} userId={userId} />
          {selectedChannel &&
            (selectedMember !== null ? (
              <ChannelMemberDetails
                member={selectedMember}
                onClose={() => setSelectedMember(null)}
              />
            ) : (
              <ChannelMembers
                onMemberSelected={(member) => setSelectedMember(member)}
                channelId={selectedChannel.id}
              />
            ))}
        </>
      ) : (
        <UserIdPrompt setUserId={setUserId} />
      )}
    </div>
  );
}
