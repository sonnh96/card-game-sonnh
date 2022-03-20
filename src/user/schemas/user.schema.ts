import * as mongoose from 'mongoose';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema ({
    fullName: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: [true, 'NAME_IS_BLANK'],
    },
    email: {
        type: String,
        lowercase: true,
        validate: validator.isEmail,
        maxlength: 255,
        minlength: 6,
        required: [true, 'EMAIL_IS_BLANK'],
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: [true, 'PASSWORD_IS_BLANK'],
    },
    verification: {
        type: String,
        validate: validator.isUUID,
    },
    verified: {
        type: Boolean,
        default: true,
    },
    verificationExpires: {
        type: Date,
        default: Date.now,
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
    accountBalance: {
        type: Number,
        default: 10,
    },
    cards: [{ type: mongoose.Types.ObjectId, ref: 'Card' }],
}, {
    versionKey: false,
    timestamps: true,
});

UserSchema.pre('save', async function(next: mongoose.HookNextFunction) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
      const hashed = await bcrypt.hash(this['password'], 10);
      this['password'] = hashed;
      return next();
    } catch (err) {
      return next(err);
    }
  });
