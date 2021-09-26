// @flow
// import {
//     // CLUSTER_CREATED,
//     // PLAN_UPDATED,
//     // PLAN_ACTION_ERROR,
// } from 'shared/commands';
import BaseCommand from 'src/commands/BaseCommand';
import { CREATE_NEW_USER_COMMAND_DEFINITION_ID } from 'src/commands/command-ids';
import { USER_TOPIC } from 'src/commands/topics';


export class CreateNewUserCommand extends BaseCommand {
    get commandDefinitionID() {
        return CREATE_NEW_USER_COMMAND_DEFINITION_ID;
    }

    get topic() {
        return USER_TOPIC;
    }
}

export class CreatedNewUserCommandHandler extends CreateNewUserCommand {
    constructor(message: any, { ioc }: any) {
        super(message, ioc);
        this.userDomain = ioc.getDomain('user');
        this.logger = ioc.getService('logging');
        this.serviceName = ioc.getConstant('service-name');
        this.restoreFromMessage(message);
    }

    async do() {
        try {
            await this.userDomain.createUser(this.commandData);
        } catch (e) {
            this.logger.error(`Could not create users in service ${process.env.SERVICE_NAME}. %s`, e);
        }
        return Promise.resolve();
    }

    undo() {}
}
