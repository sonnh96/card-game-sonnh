import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CardModule  } from './card/card.module';
import { AuthModule } from './auth/auth.module';
import { CommandModule } from 'nestjs-command';
@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), CardModule, UserModule, AuthModule, CommandModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
