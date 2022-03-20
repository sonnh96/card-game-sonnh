
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './app.module';

async function bootstrap () {
  console.log("AAAAAAAAAAAAAAAAAa");

  const app = await NestFactory.createApplicationContext(AppModule);
  console.log("BBBBBBBBBBBB");
  console.log(app.get(CommandService));
  try {
    await app
      .select(CommandModule)
      .get(CommandService)
      .exec();
    await app.close()
  } catch (error) {
    console.error(error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();