import { z } from 'zod';

export const JoinChannelScheme = z
  .object({
    channelId: z.string().uuid(),
    userId: z.string().uuid(),
    password: z.string().optional(),
  })
  .strict();

export type JoinChannelDto = z.infer<typeof JoinChannelScheme>;
