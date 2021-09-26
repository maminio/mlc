// @flow

import { createServer } from 'http';
import signale from 'signale';
import createApp from 'src/server/app';
import type { App } from 'flow-typed/ioc-types';
import type { ConfigService } from 'src/services/config/ConfigServiceInterface';
import type { LogService } from 'flow-typed/ioc-service-logging';

export type Controllers = Function<void>;
export type Middlewares = Function<App>;


export default async ({
    controllers, port, middlewares, consumers: consumerConstructor = () => [], requisites, ...serviceConfigs
}: { controllers: Controllers,
                            port: number,
                            middlewares: Middlewares,
                            moduleArgs: any,
                        }) => {
    const boundInterface = typeof parseInt(port, 10) === 'number' ? `port ${port}` : `pipe ${port}`;
    // express app
    const app = createApp({ controllers, serviceConfigs });
    middlewares(app);

    const server = createServer(app);
    app.configureRoutes();
    const logService: LogService = app.systemIoc().getService('logging');


    // Registering event consumers.
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


    server.listen(port);

    server.on('error', (error: { syscall: string, code: number }) => {
        if (error.syscall !== 'listen') {
            throw error;
        }
    });

    server.on('listening', () => {
        signale.success(`mlc ${process.env.SERVICE_NAME} Listening on ${boundInterface}`);
        if (requisites) {
            requisites(app.systemIoc());
        }
    });
};
