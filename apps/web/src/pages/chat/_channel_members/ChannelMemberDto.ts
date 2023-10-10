import { z } from "zod";

export const ChannelMemberScheme = z.array(
  z.object({
    isAdmin: z.boolean(),
    isMuted: z.boolean(),
    muteDuration: z.number().nullable(),
    user: z.object({
      id: z.string().uuid(),
      username: z.string(),
      login: z.string(),
      image: z.string().url(),
      state: z.union([
        z.literal("DO_NOT_DISTURB"),
        z.literal("IN_MATCH"),
        z.literal("OFFLINE"),
        z.literal("ONLINE"),
      ]),
    }),
  })
);

export type ChannelMemberDto = z.infer<typeof ChannelMemberScheme>[number];
