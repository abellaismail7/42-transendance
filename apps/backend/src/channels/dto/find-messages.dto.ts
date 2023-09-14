import { z } from 'zod';

export const FindMessagesScheme = z
  .object({
    userId: z.string().uuid(),
    channelId: z.string().uuid(),
  })
  .strict();

export type FindMessagesDto = z.infer<typeof FindMessagesScheme>;
