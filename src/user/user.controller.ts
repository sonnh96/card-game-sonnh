import { Roles } from './../auth/decorators/roles.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiUseTags,
    ApiBearerAuth,
    ApiImplicitHeader,
    ApiOperation,
} from '@nestjs/swagger';

@ApiUseTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({title: 'Register user',})
    @ApiCreatedResponse({})
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Login User',})
    @ApiOkResponse({})
    async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto) {
        return await this.userService.login(req, loginUserDto);
    }

    @Post('refresh-access-token')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({title: 'Refresh Access Token with refresh token',})
    @ApiCreatedResponse({})
    async refreshAccessToken(@Body() refreshAccessTokenDto: RefreshAccessTokenDto) {
        return await this.userService.refreshAccessToken(refreshAccessTokenDto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Reset password after verify reset password',})
    @ApiBearerAuth()
    @ApiImplicitHeader({
        name: 'Authorization',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.userService.resetPassword(resetPasswordDto);
    }

    @Get('info')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({title: 'A private route for check the auth',})
    @ApiImplicitHeader({
        name: 'Authorization',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async getUserData(@Req() req: any) {
        return this.userService.getUserData(req);
    }

    @Get('cards')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({title: 'A private route for check the auth',})
    @ApiImplicitHeader({
        name: 'Authorization',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async getUserCard(@Req() req: any) {
        return this.userService.getUserCard(req.user.email);
    }
}
