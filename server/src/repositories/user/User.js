// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';
import { model } from 'mlc-ioc/lib/ioc/helpers';
import $ from 'mongo-dot-notation';
import type { Interface as User } from '../../models/user';

export default class UserRepository {
    UserModel: User;

    constructor(userModel: User) {
        this.UserModel = userModel;
    }

    /**
     * Get users
     *
     * @memberof UserRepository
     * @returns {Promise<User[]>}
     */
    getUsers(): Promise<User[]> {
        return this.UserModel.find({});
    }

    /**
     * Get an user by ID
     *
     * @memberof UserRepository
     * @param {string} userId - the Id of the user
     * @returns {Promise<User>}
     */
    getUserById(userId: string): Promise<User> {
        return this.UserModel.findById(userId);
    }

    /**
     * Get an user by username
     *
     * @memberof UserRepository
     * @param {string} username - the username of the user
     * @returns {Promise<User>}
     */
    getUserByUsername(username: string): Promise<User> {
        return this.UserModel.findOne({ username });
    }


    /**
     * Update user info by ID
     * @param {string} userId - the user's ID
     * @param {object} params - the user's attributes.
     * @returns {Promise<User>}
     */
    updateUserById(userId: string, params: Object): Promise<User> {
        return this.UserModel.findOneAndUpdate({ _id: userId }, $.flatten(params), (err, user) => {
            if (!err) {
                if (params.password) {
                    Object.assign(user, params);
                    user.markModified('password');
                }
                user.save();
            }
        });
    }


    /**
     * Verify user by ID
     * @param {string} userId - the user's ID
     * @param {string} token - the user's new token
     * @returns {Promise<any>}
     */
    verifyUserById(userId: string, token: string): Promise<User> {
        return this.UserModel.findOneAndUpdate({ _id: userId }, { $set: { token, isVerified: true } }, {
            multi: false,
            new: true,
            useFindAndModify: false,
        });
    }

    /**
     * Create user.
     * @param {object} params - the user' parameters
     * @returns {Promise<user>}
     */
    createUser(params): Promise<User> {
        return this.UserModel.create(params);
    }
}


inversify.annotate(
    UserRepository,
    [
        model('user'),
    ],
);
