import { z } from 'zod';

export const SendMessageScheme = z
  .object({
    senderId: z.string().uuid(),
    channelId: z.string().uuid(),
    content: z.string(),
  })
  .strict();

export type SendMessageDto = z.infer<typeof SendMessageScheme>;
