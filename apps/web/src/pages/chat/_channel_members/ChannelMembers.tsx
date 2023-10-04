import { useChannelMembers } from "./ChannelMembersRepository";

export type ChannelMembersProps = {
  channelId: string;
};

export function ChannelMembers({ channelId }: ChannelMembersProps) {
  const { isSuccess, data: members } = useChannelMembers(channelId);

  return (
    <div className="flex h-full w-[350px] flex-col gap-[24px]">
      <p className="text-[18px] font-bold">Memebers</p>
      {isSuccess && (
        <div className="flex flex-col w-full gap-[12px]">
          {members.map((member, index) => (
            <div
              key={index}
              className="flex flex-row w-full gap-[14px] p-[8px] items-center rounded-[8px] border-[1px] border-black"
            >
              <div className="flex flex-col flex-1">
                <p className="text-[16px] font-semibold line-clamp-1">
                  {member.user.username}
                </p>
                <p className="text-[14px] line-clamp-1">{member.user.login}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
