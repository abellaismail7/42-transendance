import { ChannelMemberDto, ChannelMemberScheme } from "./ChannelMemberDto";
import { useQuery } from "react-query";
import { api } from "../globals";

export function useChannelMembers(channelId: string) {
  return useQuery({
    queryKey: ["members", channelId],
    queryFn: async (): Promise<ChannelMemberDto[]> => {
      const { data } = await api.get(`/channels/members/${channelId}`);
      return ChannelMemberScheme.parse(data);
    },
  });
}
