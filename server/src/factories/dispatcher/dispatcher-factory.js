// @flow

import { interfaces } from 'inversify';
import { KeyedMessage } from 'kafka-node';
import boom from '@hapi/boom';

import type { LogService } from 'flow-typed/ioc-service-logging';
import type { Interface as ProducerService } from 'src/services/event-producer/ProducerService';
import type BaseCommand from 'src/commands/BaseCommand';

import type { IoCContainer } from 'flow-typed/types';

class CommandDispatcher {
    eventProducer: ProducerService;

    logService: LogService;

    clientName: string;

    domainName: string;

    userId: string;

    constructor(ioc: IoCContainer) {
        this.eventProducer = ioc.getService('event-producer');
        this.logService = ioc.getService('logging');
        this.serviceName = ioc.getConstant('service-name');
        this.hostname = ioc.getConstant('service-name');
        this.domainName = ioc.getConstant('domain-name');
    }

    async dispatch(command: BaseCommand) {
        const message = command.prepareMessage({
            serviceName: this.serviceName,
            domainName: this.domainName,
            hostname: this.hostname,
        });
        const { topic } = command;
        try {
            this.logService.info('dispatching command', message);
            await this.eventProducer.dispatch([
                {
                    topic,
                    partition: 0,
                    messages: [new KeyedMessage('command', JSON.stringify(message))],
                },
            ]);
            return message;
        } catch (error) {
            this.logService.error(error);
            throw boom.internal('Command not enqueued due to error', error);
        }
    }
}

export default (context: interfaces.Context) => (new CommandDispatcher(context.container));
