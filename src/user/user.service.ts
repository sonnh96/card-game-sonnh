import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';
import { AuthService } from './../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { addHours } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { ForgotPassword } from './interfaces/forgot-password.interface';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {

    HOURS_TO_VERIFY = 4;
    HOURS_TO_BLOCK = 6;
    LOGIN_ATTEMPTS_TO_BLOCK = 5;

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('ForgotPassword') private readonly forgotPasswordModel: Model<ForgotPassword>,
        private readonly authService: AuthService,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new this.userModel(createUserDto);
        await this.isEmailUnique(user.email);
        this.setRegistrationInfo(user);
        await user.save();
        return this.buildRegistrationInfo(user);
    }

    async login(req: Request, loginUserDto: LoginUserDto) {
        const user = await this.findUserByEmail(loginUserDto.email);
        this.isUserBlocked(user);
        await this.checkPassword(loginUserDto.password, user);
        await this.passwordsAreMatch(user);
        return {
            fullName: user.fullName,
            email: user.email,
            accessToken: await this.authService.createAccessToken(user._id),
            refreshToken: await this.authService.createRefreshToken(req, user._id),
        };
    }

    async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
        const userId = await this.authService.findRefreshToken(refreshAccessTokenDto.refreshToken);
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new BadRequestException('Bad request');
        }
        return {
            accessToken: await this.authService.createAccessToken(user._id),
        };
    }
    
    async getUserData(req: any) {
       const user = req.user;
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            verified: user.verified,
            verifiedAt: user.verifiedAt,
            accessToken: await this.authService.createAccessToken(user._id),
            refreshToken: await this.authService.createRefreshToken(req, user._id),
        };
    }
 
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const forgotPassword = await this.findForgotPasswordByEmail(resetPasswordDto);
        await this.setForgotPasswordFinalUsed(forgotPassword);
        await this.resetUserPassword(resetPasswordDto);
        return {
            email: resetPasswordDto.email,
            message: 'password successfully changed.',
        };
    }

    private async isEmailUnique(email: string) {
        const user = await this.userModel.findOne({ email, verified: true });
        if (user) {
            throw new BadRequestException('Email most be unique.');
        }
    }

    private setRegistrationInfo(user): any {
        user.verification = v4();
        user.verificationExpires = addHours(new Date(), this.HOURS_TO_VERIFY);
    }

    private buildRegistrationInfo(user): any {
        const userRegistrationInfo = {
            fullName: user.fullName,
            email: user.email,
            verified: user.verified,
        };
        return userRegistrationInfo;
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email, verified: true });
        if (!user) {
            throw new NotFoundException('Wrong email or password.');
        }
        return user;
    }

    async getUserCard(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email, verified: true }).populate("cards");
        if (!user) {
            throw new NotFoundException('Wrong email or password.');
        }
        return user;
    }

    private async checkPassword(attemptPass: string, user) {
        const match = await bcrypt.compare(attemptPass, user.password);
        if (!match) {
            await this.passwordsDoNotMatch(user);
            throw new NotFoundException('Wrong email or password.');
        }
        return match;
    }

    private isUserBlocked(user) {
        if (user.blockExpires > Date.now()) {
            throw new ConflictException('User has been blocked try later.');
        }
    }

    private async passwordsDoNotMatch(user) {
        user.loginAttempts += 1;
        await user.save();
        if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
            await this.blockUser(user);
            throw new ConflictException('User blocked.');
        }
    }

    private async blockUser(user) {
        user.blockExpires = addHours(new Date(), this.HOURS_TO_BLOCK);
        await user.save();
    }

    private async passwordsAreMatch(user) {
        user.loginAttempts = 0;
        await user.save();
    }

    private async findForgotPasswordByEmail(resetPasswordDto: ResetPasswordDto): Promise<ForgotPassword> {
        const forgotPassword = await this.forgotPasswordModel.findOne({
            email: resetPasswordDto.email,
            firstUsed: true,
            finalUsed: false,
            expires: { $gt: new Date() },
        });
        if (!forgotPassword) {
            throw new BadRequestException('Bad request.');
        }
        return forgotPassword;
    }

    private async setForgotPasswordFinalUsed(forgotPassword: ForgotPassword) {
        forgotPassword.finalUsed = true;
        await forgotPassword.save();
    }

    private async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
        const user = await this.userModel.findOne({
            email: resetPasswordDto.email,
            verified: true,
        });
        user.password = resetPasswordDto.password;
        await user.save();
    }
}
