import { Channel } from "../_dto/ChannelDto";
import { Messages } from "./MessageItem";

export type ChatSpaceProps = {
  channel: Channel | null;
  userId: string;
  onSend: (channelId: string, message: string) => void;
};

export function ChatSpace({ channel, userId, onSend }: ChatSpaceProps) {
  if (channel === null) {
    return (
      <div className="flex items-center justify-center flex-1 h-full">
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

  return <Messages userId={userId} channel={channel} onSend={onSend} />;
}
