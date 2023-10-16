import { z } from 'zod';

export const InviteUserScheme = z
  .object({
    channelId: z.string().uuid(),
    receiverId: z.string().uuid(),
  })
  .strict();

export type InviteUserDto = z.infer<typeof InviteUserScheme>;
