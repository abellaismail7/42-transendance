import { useQuery } from "react-query";
import { api } from "../globals";
import { z } from "zod";

export const MemberScheme = z.array(
  z.object({
    isAdmin: z.boolean(),
    isMuted: z.boolean(),
    muteDuration: z.number().nullable(),
    user: z.object({
      id: z.string().uuid(),
      username: z.string(),
      login: z.string(),
      state: z.union([
        z.literal("DO_NOT_DISTURB"),
        z.literal("IN_MATCH"),
        z.literal("OFFLINE"),
        z.literal("ONLINE"),
      ]),
    }),
  })
);

export function useChannelMembers(channelId: string) {
  return useQuery({
    queryKey: ["members", channelId],
    queryFn: async () => {
      const { data } = await api.get(`/channels/members/${channelId}`);
      return MemberScheme.parse(data);
    },
  });
}
