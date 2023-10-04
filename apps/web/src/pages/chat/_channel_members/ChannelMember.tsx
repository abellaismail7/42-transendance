import { ChannelMemberDto } from "./ChannelMemberDto";
import { Avatar } from "@nextui-org/react";

export type ChannelMemberProp = {
  onClick: (member: ChannelMemberDto) => void;
  member: ChannelMemberDto;
};

export function ChannelMember({ member, onClick }: ChannelMemberProp) {
  return (
    <div
      className="flex flex-row w-full gap-[14px] p-[8px] items-center rounded-[8px] border-[1px] border-black"
      onClick={() => onClick(member)}
    >
      <Avatar src={member.user.image} size="lg" />
      <div className="flex flex-col flex-1">
        <p className="text-[16px] font-semibold line-clamp-1">
          {member.user.username}
        </p>
        <p className="text-[14px] line-clamp-1">{member.user.login}</p>
      </div>
    </div>
  );
}
