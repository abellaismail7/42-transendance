import { z } from 'zod';

// export class UpdateUserDto {
//   name!: string; // !: means ta yt ytconstructa 3ad yt assigna
//   email!: string;
//   password!: string;
// }

export const updateUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export type UpdateUserDtoType = z.infer<typeof updateUserSchema>;
