// @flow
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import type { LogService } from 'flow-typed/ioc-service-logging';
import type { EventProcessor } from './EventProcessor';


class GeneralEventProcessor implements EventProcessor {
    key: string[];

    topics: string[];

    logger: LogService;

    constructor(key, topics) {
        this.key = key;
        this.topics = topics;
    }


    process(message: any, iocContainer: any): Promise<any> {
        this.logger = iocContainer.getService('logging');
        this.commandFactory = iocContainer.getFactory('commands');
        return this.handleRawMessage(message);
    }

    async handleRawMessage(message: Object) {
        try {
            await this.handleCommandMessage(message);
            this.logger.info('command ran successfully.');
            return Promise.resolve(true);
        } catch (e) {
            this.logger.error('Error handling incoming message! %s', e);
            return Promise.reject();
        }
    }

    async handleCommandMessage(commandMessage: { id: string, commandDefinitionID: string, context: Object, commandData: Object }) {
        const CommandClass = this.commandFactory.createNewCommand(commandMessage.commandDefinitionID);
        const commandInstance = new CommandClass(commandMessage);
        return commandInstance.do();
    }
}


export default (key, topics) => () => new GeneralEventProcessor(key, topics);
