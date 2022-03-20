import { MongooseModule } from '@nestjs/mongoose';
import { CardSchema } from './schemas/card.schema';
import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Card', schema: CardSchema }]),
    UserModule,
  ],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
