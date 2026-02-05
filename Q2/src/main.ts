import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // query/param을 DTO 타입으로 변환
      whitelist: true, // DTO에 없는 속성 제거
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
