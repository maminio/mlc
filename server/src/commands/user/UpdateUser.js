// @flow

import BaseCommand from 'src/commands/BaseCommand';
import { UPDATE_USER_COMMAND_DEFINITION_ID } from 'src/commands/command-ids';
import { USER_TOPIC } from 'src/commands/topics';


export class UpdateUserCommand extends BaseCommand {
    get commandDefinitionID() {
        return UPDATE_USER_COMMAND_DEFINITION_ID;
    }

    get topic() {
        return USER_TOPIC;
    }
}

export class UpdateUserCommandHandler extends UpdateUserCommand {
    constructor(message: any, { ioc }: any) {
        super(message, ioc);
        this.userDomain = ioc.getDomain('user');
        this.logger = ioc.getService('logging');
        this.serviceName = ioc.getConstant('service-name');
        this.restoreFromMessage(message);
    }

    async do() {
        const { userId, params } = this.commandData;
        try {
            await this.userDomain.updateUserById(userId, params);
        } catch (e) {
            this.logger.error(`Could not update users in service ${process.env.SERVICE_NAME}. %s`, e);
        }
        return Promise.resolve();
    }

    undo() {}
}
