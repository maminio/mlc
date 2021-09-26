// @flow
import server from 'micro-services/utils/BaseServer';
import {
    CONNECTORS, SERVICES, FACTORIES, REPOSITORIES,
} from 'micro-services/utils/modules';
import middlewares from './middlewares';
import controllers from './controllers';
import requisites from './requisites';

export default port => server({
    controllers,
    middlewares,
    requisites,
    port: 3000,
    connectors: [CONNECTORS.MONGO_DB],

    repositories: [
        REPOSITORIES.USER,
        REPOSITORIES.DEPLOYMENT,
    ],

    factories: [FACTORIES.COMMANDS, FACTORIES.REDIS_OSCB, FACTORIES.DISPATCHER],
    services: [
        SERVICES.AUTH,
        SERVICES.CONFIG,
        SERVICES.ENV,
        SERVICES.REGISTRATION,
        SERVICES.DEPLOYMENT,
    ],

    defaultServiceName: process.env.SERVICE_NAME,
    defaultDomainName: 'local-mlc.ai',
});
