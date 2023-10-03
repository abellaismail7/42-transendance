import { z } from 'zod';

const PasswordRegexValidator =
  /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{8,}$/gs;

export const CreateChannelScheme = z
  .object({
    name: z.string(),
    ownerId: z.string().uuid(),
    access: z.union([
      z.literal('PROTECTED'),
      z.literal('PRIVATE'),
      z.literal('PUBLIC'),
    ]),
    password: z
      .string()
      .regex(PasswordRegexValidator, {
        message:
          'The password must be at least 8 characters long and contains \
at least one uppercase letter, \
at least one lowercase letter, \
at least one digit charcter and \
at least one special character.',
      })
      .optional(),
  })
  .strict()
  .refine(
    (object) => {
      return object.access === 'PROTECTED'
        ? object.password !== undefined
        : object.password === undefined;
    },
    {
      message:
        'A password must be supplied only when access is set to Protected',
    },
  );

export type CreateChannelDto = z.infer<typeof CreateChannelScheme>;
