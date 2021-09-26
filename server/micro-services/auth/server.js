// @flow
import server from 'micro-services/utils/BaseServer';
import {
    CONNECTORS, SERVICES, FACTORIES,
} from 'micro-services/utils/modules';
import middlewares from './middlewares';
import controllers from './controllers';

export default port => server({
    controllers,
    middlewares,
    port,
    connectors: [CONNECTORS.MONGO_DB],
    models: [],
    factories: [FACTORIES.COMMANDS, FACTORIES.REDIS_OSCB, FACTORIES.DISPATCHER],
    services: [
        SERVICES.AUTH,
        SERVICES.CONFIG,
        SERVICES.ENV,
        SERVICES.REGISTRATION,
        SERVICES.EMAIL,
    ],
    defaultServiceName: process.env.SERVICE_NAME,
    defaultDomainName: 'local-mlc.ai',
});
