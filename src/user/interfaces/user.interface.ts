import { Document, Types, Schema } from 'mongoose';

export interface User extends Document {
    fullName: string;
    email: string;
    password: string;
    verified: boolean;
    loginAttempts?: number;
    blockExpires?: Date;
    accountBalance?: number;
    cards: Array<string>;
}
