// @flow

import Mongoose from 'mongoose';
import Bcrypt from 'bcryptjs';
import { interfaces } from 'inversify';

export default (context: interfaces.Context) => {
    const mongooseConnection: Mongoose = context.container.getConnector('mongodb');

    const UserSchema = Mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
        },
        type: {
            type: String,
            default: 'ADMIN',
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
            required: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        registerDate: {
            type: Date,
            default: new Date(),
            required: true,
        },
    }, { timestamps: true });

    UserSchema.pre('save', function (next) {
        /*
        wasNew field will be used in post-save to detect whether the document is new or not
        */
        this.wasNew = this.isNew;
        if (!this.isModified('password')) {
            return next();
        }
        this.password = Bcrypt.hashSync(this.password, 10);
        return next();
    });

    UserSchema.methods.comparePassword = function (plaintext) {
        return new Promise((res, rej) => {
            const match = Bcrypt.compareSync(plaintext, this.password);
            if (match) {
                return res(match);
            }
            return rej(match);
        });
    };


    return mongooseConnection.model('User', UserSchema);
};

export type Interface = Mongoose.Model;
