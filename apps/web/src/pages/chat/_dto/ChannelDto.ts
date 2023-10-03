import { z } from "zod";

export const ChannelsScheme = z.array(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    image: z.string().url(),
    lastMessage: z.string().nullable(),
    joinStatus: z.union([z.literal("WAIT_FOR_APPROVAL"), z.literal("JOINED")]),
  })
);

export type Channel = z.infer<typeof ChannelsScheme>[number];
