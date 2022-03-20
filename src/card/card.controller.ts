import { Roles } from '../auth/decorators/roles.decorator';
import { Request } from 'express';
import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ExchangeCardDto } from './dto/exchange-card.dto';
import { BattleRequestDto } from './dto/battle-request.dto';
import { CardService } from './card.service';
import { GetQueryDto } from './dto/get-card.dto';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiUseTags,
    ApiBearerAuth,
    ApiImplicitHeader,
    ApiOperation,
} from '@nestjs/swagger';

@ApiUseTags('Card')
@Controller('card')
export class CardController {
    constructor(
        private readonly cardService: CardService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ title: 'Get cards', })
    @ApiCreatedResponse({})
    async getCard(@Param() getQueryDto: GetQueryDto) {
        return await this.cardService.getCard(getQueryDto);
    }

    // @Get('')
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({title: 'Get user\'s cards', })
    // @ApiCreatedResponse({})
    // async getUserCard(@Param() getUserCardsDto: GetUserCardsDto) {
    //     return await this.cardService.getUserCard(getUserCardsDto);
    // }

    @Post('buy')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ title: 'Buy card', })
    @ApiImplicitHeader({
        name: 'Authorization',
        description: 'the token we need for auth.'
    })
    async buyCard(@Body() buyCardDto: ExchangeCardDto, @Req() req: any) {
        return await this.cardService.buyCard(buyCardDto, req.user.email);
    }

    @Post('sell')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ title: 'Sell card', })
    @ApiImplicitHeader({
        name: 'Authorization',
        description: 'the token we need for auth.'
    })
    async sellCard(@Body() sellCardDto: ExchangeCardDto, @Req() req: any) {
        return await this.cardService.sellCard(sellCardDto, req.user.email);
    }

    @Post('battle')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ title: 'Battle', })
    async battle(@Body() req: BattleRequestDto) {
        return await this.cardService.battle(req);
    }
}
