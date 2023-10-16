import { useMutation, useQuery, useQueryClient } from "react-query";
import { ChevronDown, PlusCircle, Search } from "lucide-react";
import { SearchChannelsModal } from "./SearchChannelsModal";
import { CreateChannelModal } from "./CreateChannelModal";
import { useChannels } from "./ChannelsRepository";
import { ChannelDto } from "./ChannelDto";
import { useState } from "react";
import { Channel } from "./Channel";
import { api } from "../globals";
import { z } from "zod";

import {
  useDisclosure,
  CircularProgress,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
} from "@nextui-org/react";

export type ChannelsProps = {
  onChannelSelected: (channel: ChannelDto) => void;
  isSelected: (channel: ChannelDto) => boolean;
  userId: string;
};

function Channels({ onChannelSelected, isSelected, userId }: ChannelsProps) {
  const { isLoading, isError, isSuccess, data: channels } = useChannels(userId);

  return (
    <>
      {isLoading && <CircularProgress aria-label="Loading..." />}
      {isError && (
        <p className="text-center">
          An error occured while trying reching the server
        </p>
      )}
      {isSuccess && (
        <div className="flex flex-col h-full w-full gap-[12px]">
          {channels.map((channel, index) => (
            <Channel
              key={index}
              onClick={onChannelSelected}
              channel={channel}
              isSelected={isSelected(channel)}
            />
          ))}
        </div>
      )}
    </>
  );
}

const InvitationsScheme = z.array(
  z
    .object({
      id: z.string().uuid(),
      channelId: z.string().uuid(),
      receiverId: z.string().uuid(),
      channel: z
        .object({
          image: z.string().url(),
          name: z.string(),
        })
        .strict(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })
    .strict()
);

type Invitation = z.infer<typeof InvitationsScheme>[number];

function useInvitations(userId: string) {
  return useQuery(["invitations", userId], async () => {
    const { data } = await api.get("/channels/invitations", {
      params: { userId },
    });
    return InvitationsScheme.parse(data);
  });
}

type InvitationItemProps = {
  invitation: Invitation;
  accept: (id: string) => void;
  reject: (id: string) => void;
};

function InvitationItem({ invitation, accept, reject }: InvitationItemProps) {
  return (
    <div
      key={invitation.id}
      className="flex flex-row items-center justify-between"
    >
      <div className="flex flex-row items-center gap-[8px]">
        <Avatar src={invitation.channel.image} />
        <p>{invitation.channel.name}</p>
      </div>
      <div className="flex flex-row items-center gap-[8px]">
        <Button size="sm" color="danger" onClick={() => reject(invitation.id)}>
          Reject
        </Button>
        <Button size="sm" color="primary" onClick={() => accept(invitation.id)}>
          Accept
        </Button>
      </div>
    </div>
  );
}

type InvitationsProps = {
  userId: string;
};

function Invitations({ userId }: InvitationsProps) {
  const {
    isLoading,
    isError,
    isSuccess,
    data: invitations,
  } = useInvitations(userId);

  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      return await api.post("/channels/invitations/accept", null, {
        params: { id: invitationId },
      });
    },
    onSuccess: () => queryClient.invalidateQueries("invitations"),
  });

  const rejectMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      return api.post("/channels/invitations/reject", null, {
        params: { id: invitationId },
      });
    },
    onSuccess: () => queryClient.invalidateQueries("invitations"),
  });

  return (
    <>
      {isLoading && <CircularProgress aria-label="Loading..." />}
      {isError && (
        <p className="text-center">
          An error occured while trying reching the server
        </p>
      )}
      {isSuccess && (
        <div className="flex flex-col h-full w-full gap-[12px]">
          {invitations.map((invitation) => (
            <InvitationItem
              key={invitation.id}
              invitation={invitation}
              reject={rejectMutation.mutate}
              accept={acceptMutation.mutate}
            />
          ))}
        </div>
      )}
    </>
  );
}

type Tabs = "channels" | "dms" | "invitations";

export type SideNavigationProps = {
  onChannelSelected: (channel: ChannelDto) => void;
  isSelected: (channel: ChannelDto) => boolean;
  userId: string;
};

export function SideNavigation({
  onChannelSelected,
  isSelected,
  userId,
}: SideNavigationProps) {
  const [selectedTab, setSelectedTab] = useState<Tabs>("channels");

  const createModal = useDisclosure();
  const searchModal = useDisclosure();

  return (
    <div className="flex flex-col h-full w-[350px] items-center justify-center">
      <div className="flex w-full pb-[24px] items-center justify-between">
        <Dropdown>
          <DropdownTrigger>
            <div className="flex">
              <p className="text-[18px] font-bold">
                {selectedTab === "channels"
                  ? "Channels"
                  : selectedTab === "dms"
                  ? "Direct Messages"
                  : "Invitations"}
              </p>
              <ChevronDown />
            </div>
          </DropdownTrigger>
          <DropdownMenu
            selectedKeys={selectedTab}
            aria-label="Navigation"
            onAction={(key) => setSelectedTab(key as Tabs)}
          >
            <DropdownItem key="channels">Channels</DropdownItem>
            <DropdownItem key="dms">Direct messages</DropdownItem>
            <DropdownItem key="invitations">Invitations</DropdownItem>
          </DropdownMenu>
        </Dropdown>
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
      <div className="flex flex-col h-full w-full justify-center items-center overflow-y-scroll">
        {selectedTab === "channels" ? (
          <Channels
            userId={userId}
            onChannelSelected={onChannelSelected}
            isSelected={isSelected}
          />
        ) : selectedTab === "dms" ? (
          <p>Hello, direct messages!</p>
        ) : (
          <Invitations userId={userId} />
        )}
      </div>
    </div>
  );
}
