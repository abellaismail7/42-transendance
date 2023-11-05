import { z } from "zod";

export const SearchChannelScheme = z.array(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    ownerId: z.string().uuid(),
    image: z.string().url(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    access: z.union([z.literal("PROTECTED"), z.literal("PUBLIC")]),
  })
);

export type SearchChannelDto = z.infer<typeof SearchChannelScheme>[number];
