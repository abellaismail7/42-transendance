import { z } from "zod";

export const ChannelsScheme = z.array(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    image: z.string().url(),
    lastMessage: z.string().nullable(),
  })
);

export type ChannelDto = z.infer<typeof ChannelsScheme>[number];
