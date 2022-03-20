import { Schema } from 'mongoose';
import * as validator from 'validator';

export const ForgotPasswordSchema = new Schema ({
    email: {
        required: [true, 'EMAIL_IS_BLANK'],
        type: String,
        requierd: true,
    },
    verification: {
        type: String,
        validate: validator.isUUID,
        requierd: true,
    },
    expires: {
        type: Date,
        requierd: true,
    },
},
{
    versionKey: false,
    timestamps: true,
});
