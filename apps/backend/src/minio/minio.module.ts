import { Module } from '@nestjs/common';
import { Client as MinioClient } from 'minio';
import { ConfigModule } from '@nestjs/config';
import { MinioService } from './minio.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: MinioClient,
      useValue: new MinioClient({
        endPoint: 'localhost',
        useSSL: false,
        port: 9000,
        accessKey: process.env.MINIO_ACCESS_KEY!,
        secretKey: process.env.MINIO_SECRET_KEY!,
      }),
    },
    MinioService,
  ],
  exports: [MinioService],
})
export class MinioModule {}
