import { ChannelDto } from "../_channels/ChannelDto";
import { Messages } from "./Messages";

export type ChatSpaceProps = {
  channel: ChannelDto | null;
  userId: string;
};

export function ChatSpace({ channel, userId }: ChatSpaceProps) {
  if (channel === null) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p>To start chatting, select one of the channels.</p>
      </div>
    );
  }

  return <Messages userId={userId} channel={channel} />;
}
