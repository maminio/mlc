// @flow
import BaseCommand from 'src/commands/BaseCommand';
import { PROVISION_STATUS_UPDATE_COMMAND_DEFINITION_ID } from 'src/commands/command-ids';
import type { LogService } from 'flow-typed/ioc-service-logging';


export class ProvisionStatusUpdateCommand extends BaseCommand {
    // eslint-disable-next-line class-methods-use-this
    get commandDefinitionID() {
        return PROVISION_STATUS_UPDATE_COMMAND_DEFINITION_ID;
    }


    get topic() {
        // return this.ioc.getService('config').getProvisionerTopic();
        return 'api-provisioner-stream';
    }
}

export class ProvisionStatusUpdateCommandHandler extends ProvisionStatusUpdateCommand {
    logger: LogService;

    serviceName: string;


    constructor(message: any, { ioc }: any) {
        super(message, ioc);
        this.logger = ioc.getService('logging');
        this.serviceName = ioc.getConstant('service-name');
        this.restoreFromMessage(message);

    }

    async do() {}

    undo() {}
}
