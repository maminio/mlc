// @flow
import BaseCommand from 'src/commands/BaseCommand';
import { PROVISION_NEW_SERVICE_COMMAND_DEFINITION_ID } from 'src/commands/command-ids';
import type { LogService } from 'flow-typed/ioc-service-logging';


export class ProvisionNewServiceCommand extends BaseCommand {
    // eslint-disable-next-line class-methods-use-this
    get commandDefinitionID() {
        return PROVISION_NEW_SERVICE_COMMAND_DEFINITION_ID;
    }


    get topic() {
        return 'worker-provisioner-stream';
    }
}

export class ProvisionNewServiceCommandHandler extends ProvisionNewServiceCommand {
    logger: LogService;

    serviceName: string;


    constructor(message: any, { ioc }: any) {
        super(message, ioc);
        this.logger = ioc.getService('logging');
        this.serviceName = ioc.getConstant('service-name');
        this.openfaasService = ioc.getService('openfaas');
        this.builderService = ioc.getService('builder');
        this.restoreFromMessage(message);

    }

    do() {
        return this.builderService.deploy(this.commandData);
    }

    undo() {}
}
