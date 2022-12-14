import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import * as cookieParser from 'cookie-parser';

(async () => {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.use(cookieParser());

  await app.listen(4001);
})();
