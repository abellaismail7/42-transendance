import { Injectable } from '@nestjs/common';
import { Client as MinioClient } from 'minio';

@Injectable()
export class MinioService {
  constructor(private readonly minio: MinioClient) {}

  async writeAvatar(name: string, image: Buffer) {
    this.minio.putObject('avatars', name, image, image.length);
  }
}
