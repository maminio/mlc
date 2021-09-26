// @flow

import createApp from 'src/server/app';

import type { ConfigService } from 'src/services/config/ConfigServiceInterface';
import type { LogService } from 'flow-typed/ioc-service-logging';

export default async ({ consumers: consumerConstructor = () => [], ...serviceConfigs }) => {
    const app = createApp({ serviceConfigs });
    const workerIoC = app.systemIoc();
    const logService: LogService = workerIoC.getService('logging');
    const eventConsumerService: ConsumerService = app.systemIoc().getService('event-consumer');

    const configService: ConfigService = app.systemIoc().getService('config');
    const consumers = consumerConstructor(configService);
    logService.info('Registering event listeners...');
    try {
        await Promise.all(consumers.map(event => event && eventConsumerService.registerEventProcessor(event)));
    } catch (e) {
        logService.error('Error registering event consumers to Kafka');
        process.exit(1);
    }
};
