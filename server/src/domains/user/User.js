// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';
import 'reflect-metadata'; // must be here so we can use reflect metadata when adding new services
import { repository, service } from 'mlc-ioc/lib/ioc/helpers';
import type { LogService } from 'flow-typed/ioc-service-logging';
import type { Interface as User } from '../../models/user';
import UserRepository from '../../repositories/user';

class UserDomain {
    userRepository: UserRepository;

    logger: LogService

    constructor(userRepository: UserRepository, logger: LogService) {
        this.userRepository = userRepository;
        this.logger = logger;
    }

    async getUserById(id: string): Promise<User> {
        try {
            return await this.userRepository.getUserById(id);
        } catch (error) {
            this.logger.error('Error reading user by id.', { id, error });
            return null;
        }
    }

    getUserByEmail(email: string): Promise<User> {
        try {
            return this.userRepository.getUserByEmail(email);
        } catch (error) {
            this.logger.error('Error reading user by email.', { email, error });
            return null;
        }
    }

    getUserByUsername(username: string): Promise<User> {
        try {
            return this.userRepository.getUserByUsername(username);
        } catch (error) {
            this.logger.error('Error reading user by username.', { username, error });
            return null;
        }
    }

    getUsers(): Promise<User[]> {
        try {
            return this.userRepository.getUsers();
        } catch (error) {
            this.logger.error('Error reading users.', { error });
            return null;
        }
    }

    async updateUserById(id: string, userParams: User) {
        try {
            return this.userRepository.updateUserById(id, userParams);
        } catch (error) {
            this.logger.error('Error updating user attributes by id. %s', error);
            return null;
        }
    }

    verifyUserById(id: string, token: string): Promise<User> {
        try {
            return this.userRepository.verifyUserById(id, token);
        } catch (error) {
            this.logger.error('Error reading user by email. %s', { error });
            return null;
        }
    }

    createUser(params): Promise<User> {
        try {
            return this.userRepository.createUser(params);
        } catch (error) {
            this.logger.error('Error writing new user.', { params, error });
            return null;
        }
    }

    async getUserByUsernamePassword({ username, password }) {
        const user = await this.getUserByUsername(username);
        if (!user) {
            return null;
        }
        try {
            await user.comparePassword(password);
        } catch (e) {
            this.logger.info('Wrong password entered.');
            return null;
        }
        return user;
    }
}

inversify.annotate(
    UserDomain,
    [
        repository('user'),
        service('logging'),
    ],
);

export default UserDomain;
