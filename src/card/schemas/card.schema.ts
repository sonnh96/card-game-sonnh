import * as mongoose from 'mongoose';

enum CardType {
    Water = 'water',
    Fire = 'fire',
    Wood = 'wood',
    Earth = 'earth'
}

enum PowerLevel {
    VeryWeak = '1',
    Weak = '2',
    Average = '3',
    Strong = '4',
    VeryStrong = '5'
}

const CardSchema = new mongoose.Schema({
    cardName: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: [true, 'NAME_IS_REQUIRED'],
    },
    image: {
        type: String,
        maxlength: 255,
        minlength: 6,
        required: [true, 'IMAGE_IS_REQUIRED'],
    },
    type: {
        type: CardType,
        required: true,
    },
    power: {
        type: PowerLevel,
        required: true,
    },
    users: { type: mongoose.Types.ObjectId, ref: 'Users', default: [] },
}, {
    versionKey: false,
    timestamps: true,
});

CardSchema.index({
    type: 1,
    power: 1,
}, {
    unique: true,
});

export {
    CardType,
    PowerLevel,
    CardSchema
}