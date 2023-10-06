import { Avatar, Button, Input } from "@nextui-org/react";
import { JoinRequestBody } from "./ChannelsRepository";
import { SearchChannelDto } from "./SearchChannelDto";
import { KeyRound } from "lucide-react";
import { useState } from "react";

export type SearchChannelItemProps = {
  joinChannel: (request: JoinRequestBody) => void;
  channel: SearchChannelDto;
  userId: string;
};

export function SearchChannelItem({
  channel,
  userId,
  joinChannel,
}: SearchChannelItemProps) {
  const [password, setPassword] = useState("");

  return (
    <div
      key={channel.id}
      className="flex flex-col w-full p-[12px] gap-[12px] rounded-[8px] border-[1px] border-black"
    >
      <div className="flex flex-row w-full gap-[8px] items-center">
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
        {channel.access === "PUBLIC" && (
          <Button
            size="sm"
            color="primary"
            onClick={() => joinChannel({ channelId: channel.id, userId })}
          >
            Join
          </Button>
        )}
      </div>
      {channel.access === "PROTECTED" && (
        <div className="flex flex-row items-center gap-[16px]">
          <Input
            value={password}
            placeholder="Type the password"
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            startContent={<KeyRound />}
          />
          <Button
            size="sm"
            color="primary"
            onClick={() => {
              joinChannel({ channelId: channel.id, password, userId });
            }}
          >
            Join
          </Button>
        </div>
      )}
    </div>
  );
}
