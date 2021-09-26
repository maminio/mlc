// @flow
import BaseCommand from 'src/commands/BaseCommand';
import { UPDATE_RUN_COMMAND_DEFINITION_ID } from 'src/commands/command-ids';
import type { LogService } from 'flow-typed/ioc-service-logging';
import { get } from 'lodash';
import RunDomain from 'src/domains/run';


export class UpdateRunCommand extends BaseCommand {
    // eslint-disable-next-line class-methods-use-this
    get commandDefinitionID() {
        return UPDATE_RUN_COMMAND_DEFINITION_ID;
    }


    get topic() {
        return 'run-stream';
    }
}

export class UpdateRunCommandHandler extends UpdateRunCommand {
    logger: LogService;

    serviceName: string;

    runDomain: RunDomain

    constructor(message: any, { ioc }: any) {
        super(message, ioc);
        this.logger = ioc.getService('logging');
        this.runDomain = ioc.getDomain('run');
        this.serviceName = ioc.getConstant('service-name');
        this.restoreFromMessage(message);
    }

    async do() {
        const runId = get(this.commandData, 'payload.runId');
        const status = get(this.commandData, 'payload.status', 'UNKNOWN');
        const result = get(this.commandData, 'payload.data.result', '');
        const stdout = get(this.commandData, 'payload.data.stdout', '');
        if (runId) {
            await this.runDomain.updateRun({
                _id: runId,
                status,
                result: `<'UPDATE_DEPLOYMENT_URL'>/storage/${result}`,
                consoleOutput: stdout,
            });
        }
        return Promise.resolve(true);
    }

    undo() {}
}
