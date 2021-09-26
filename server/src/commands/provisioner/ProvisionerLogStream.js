// @flow
import BaseCommand from 'src/commands/BaseCommand';
import { PROVISIONER_LOG_STREAM_COMMAND_DEFINITION_ID } from 'src/commands/command-ids';
import type { LogService } from 'flow-typed/ioc-service-logging';


export class ProvisionerLogStreamCommand extends BaseCommand {
    // eslint-disable-next-line class-methods-use-this
    get commandDefinitionID() {
        return PROVISIONER_LOG_STREAM_COMMAND_DEFINITION_ID;
    }


    get topic() {
        return this.ioc.getService('config').getProvisionerLogStreamTopic();
    }
}

export class ProvisionerLogStreamCommandHandler extends ProvisionerLogStreamCommand {
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
