import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap().catch((err) => {
  console.error('NestJS application failed to start', err);
  process.exit(1);
});
