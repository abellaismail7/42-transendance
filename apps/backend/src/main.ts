import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  type NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { fastifyApp } from './fastify/app';

async function bootstrap() {
  const adapter = new FastifyAdapter(fastifyApp);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );
  await app.listen(4000);
}
bootstrap();
