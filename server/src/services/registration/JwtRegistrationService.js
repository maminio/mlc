// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';

import mongoose from 'mongoose';
import { service, domain } from 'mlc-ioc/lib/ioc/helpers';
import UserDomain from 'src/domains/user';
import type { LogService } from 'flow-typed/ioc-service-logging';
import type { Interface as RegistrationService } from './RegistrationService';


export default class JwtRegistrationService implements RegistrationService {
    userDomain: UserDomain;

    constructor(
        userDomain: UserDomain,
        logger: LogService,
    ) {
        this.userDomain = userDomain;
        this.logger = logger;
    }

    async createNewUser({
        username, password,
    }: { email: string, password: string,
                                           companyName: string, role: string, name: string,
                                       }) {
        const _id = new mongoose.Types.ObjectId();
        const createNewUserParams = {
            _id,
            username,
            password,
            displayName: username,
        };

        // Create new user
        return (await this.userDomain.createUser(createNewUserParams));
    }


}

inversify.annotate(JwtRegistrationService,
    [
        domain('user'),
        service('logging'),
    ]);
