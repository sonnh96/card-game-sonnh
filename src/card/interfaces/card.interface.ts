import { Document } from 'mongoose';

export interface Card extends Document {
    cardName: string;
    image: string;
    type: string;
    power: number;
}
