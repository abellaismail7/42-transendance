import { ChannelDto } from "../_channels/ChannelDto";
import { Messages } from "./Messages";

export type ChatSpaceProps = {
  channel: ChannelDto | null;
  userId: string;
  onSend: (channelId: string, message: string) => void;
};

export function ChatSpace({ channel, userId, onSend }: ChatSpaceProps) {
  if (channel === null) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p>To start chatting, select one of the channels.</p>
      </div>
    );
  }

  if (channel.joinStatus === "WAIT_FOR_APPROVAL") {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p>You are not approved yet to join this channels.</p>
      </div>
    );
  }

  return <Messages userId={userId} channel={channel} onSend={onSend} />;
}
