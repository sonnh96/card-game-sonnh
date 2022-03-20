import { Request } from 'express';
import { UserService } from '../user/user.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetQueryDto } from './dto/get-card.dto';
import { ExchangeCardDto } from './dto/exchange-card.dto';
import { GetUserCardsDto } from './dto/get-user-cards.dto';
import { Card } from './interfaces/card.interface';
import { CardType, PowerLevel } from './schemas/card.schema';
import { BattleRequestDto } from './dto/battle-request.dto';

@Injectable()
export class CardService {

    constructor(
        @InjectModel('Card') private readonly cardModel: Model<Card>,
        private readonly userService: UserService,
    ) { }

    async generate() {
        const imageSuffix = ".png";

        for (let type of Object.keys(CardType)) {
            for (let power of Object.keys(PowerLevel)) {
                let card = new this.cardModel({
                    type: CardType[type],
                    cardName: `${type}${power}`,
                    power: parseInt(PowerLevel[power]),
                    image: `${type}${power}${imageSuffix}`.toLowerCase(),
                });
                card.save();
            }
        }
    }

    async getCard(query: GetQueryDto) {
        let from = query.from || 0;
        from = Number(from);
        let limit = query.limit || 10;
        limit = Number(limit);
        let id = query.id || null;
        let cards: Card[];

        try {
            if (id) {
                let card = await this.cardModel.findById(id);
                cards.push(card);
            } else if (limit === 0) {
                cards = await this.cardModel
                    .find()
                    .skip(from)
                    .sort({ createdAt: -1 })
                    .exec();
            } else {
                cards = await this.cardModel
                    .find()
                    .skip(from)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .exec();
            }
            let response;
            if (cards.length > 0) {
                response = {
                    ok: true,
                    data: cards,
                    message: 'Get cards Ok!',
                };
            } else {
                response = {
                    ok: true,
                    data: [],
                    message: 'Don\'t have cards',
                };
            }
            return response;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getUserCard(query: GetUserCardsDto) {
        let email = query.email;
        try {
            let user = this.userService.findUserByEmail(email);
            let response;
            response = {
                ok: true,
                data: user,
                message: 'Get cards Ok!',
            };
            return response;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async buyCard(payload: ExchangeCardDto, email: string) {
        let cardId = payload.card;
        let user = await this.userService.findUserByEmail(email);
        let card = await this.cardModel.findOne({'_id': Types.ObjectId(cardId)});
        if (user && card) {
            if (user.accountBalance >= card.power) {
                user.cards.push(card._id);
                user.accountBalance -= card.power;
                await user.save();
                return {
                    ok: true,
                    data: user,
                    message: 'Buy card Ok!',
                };
            } else {
                return {
                    ok: false,
                    data: null,
                    message: 'Not enough money',
                };
            }
        }
    }

    async sellCard(payload: ExchangeCardDto, email: string) {
        let cardId = payload.card;
        let user = await this.userService.findUserByEmail(email);
        let card = await this.cardModel.findOne({'_id': Types.ObjectId(cardId)});
        if (user && card) {
            const pos = user.cards.findIndex(el => el == cardId);
            if (pos >= 0)
                user.cards.splice(pos, 1);
            user.accountBalance += card.power;
            await user.save();
            return {
                ok: true,
                data: user,
                message: 'Sell card Ok!',
            };
        }
    }
    
    typeCompare(typea, typeb) {
        switch (typea) {
            case CardType.Water:
                if (typeb == CardType.Fire) {
                    return 1;
                } else if (typeb == CardType.Earth) {
                    return 0;
                } else {
                    return -1;
                }
            case CardType.Fire:
                if (typeb == CardType.Wood) {
                    return 1;
                } else if (typeb == CardType.Water) {
                    return 0;
                } else {
                    return -1;
                }
            case CardType.Wood:
                if (typeb == CardType.Earth) {
                    return 1;
                } else if (typeb == CardType.Fire) {
                    return 0;
                } else {
                    return -1;
                }
            case CardType.Earth:
                if (typeb == CardType.Water) {
                    return 1;
                } else if (typeb == CardType.Wood) {
                    return 0;
                } else {
                    return -1;
                }
            default:
                return -1;
        }
    }

    async battle(payload: BattleRequestDto) {
        let card_a = await this.cardModel.findOne({'_id': Types.ObjectId(payload.card_a)});
        let card_d = await this.cardModel.findOne({'_id': Types.ObjectId(payload.card_d)});
        let result = this.typeCompare(card_a.type, card_d.type);

        if (result < 0) {
            if (card_a.power > card_d.power) {
                result = 1;
            } else if (card_a.power < card_d.power) {
                result = 0;
            } else {
                result = Math.random() > 0.5 ? 1 : 0
            }
        }
        return {
            ok: true,
            data: result,
            message: 'Sell card Ok!',
        }
    }
}
