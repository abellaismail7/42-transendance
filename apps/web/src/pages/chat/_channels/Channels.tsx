import { ChevronDown, PlusCircle, Search } from "lucide-react";
import { SearchChannelsModal } from "./SearchChannelsModal";
import { CreateChannelModal } from "./CreateChannelModal";
import { useChannels } from "./ChannelsRepository";
import { ChannelDto } from "./ChannelDto";
import { Channel } from "./Channel";
import { useState } from "react";

import {
  useDisclosure,
  CircularProgress,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
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
      {isError && <p>An error occured while trying reching the server</p>}
      {isSuccess && (
        <>
          {channels.map((channel, index) => (
            <Channel
              key={index}
              onClick={onChannelSelected}
              channel={channel}
              isSelected={isSelected(channel)}
            />
          ))}
        </>
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
      <div className="flex flex-col h-full w-full gap-[12px] overflow-y-scroll">
        {selectedTab === "channels" ? (
          <Channels
            userId={userId}
            onChannelSelected={onChannelSelected}
            isSelected={isSelected}
          />
        ) : selectedTab === "dms" ? (
          <p>Hello, direct messages!</p>
        ) : (
          <p>Hello, invitations!</p>
        )}
      </div>
    </div>
  );
}
