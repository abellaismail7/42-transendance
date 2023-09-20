import { ZodType, ZodTypeDef } from 'zod';

import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ZodValidationPipe<Output, Def extends ZodTypeDef, Input> implements PipeTransform {
  constructor(private schema: ZodType<Output, Def, Input>) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;
    throw new BadRequestException(result.error.issues[0].message);
  }
}
