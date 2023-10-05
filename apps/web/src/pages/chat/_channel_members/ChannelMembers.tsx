import { useChannelMembers } from "./ChannelMembersRepository";
import { ChannelMemberDto } from "./ChannelMemberDto";
import { ChannelMember } from "./ChannelMember";

export type ChannelMembersProps = {
  onMemberSelected: (member: ChannelMemberDto) => void;
  channelId: string;
};

export function ChannelMembers({
  onMemberSelected,
  channelId,
}: ChannelMembersProps) {
  const { isSuccess, data: members } = useChannelMembers(channelId);

  return (
    <div className="flex h-full w-[350px] flex-col gap-[24px] overflow-y-scroll">
      <p className="text-[18px] font-bold">Memebers</p>
      {isSuccess && (
        <div className="flex flex-col w-full gap-[12px]">
          {members.map((member, index) => (
            <ChannelMember
              key={index}
              member={member}
              onClick={onMemberSelected}
            />
          ))}
        </div>
      )}
    </div>
  );
}
