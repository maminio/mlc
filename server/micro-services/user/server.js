// @flow
import apolloFederation from '../utils/ApolloFederation';
import {
    CONNECTORS, SERVICES, MODELS, FACTORIES,
} from 'micro-services/utils/modules';
import middlewares from './middlewares';
import controllers from './controllers';

export default port => apolloFederation({
    gqlEndpoint: 'user',
    controllers,
    middlewares,
    port,
    connectors: [CONNECTORS.MONGO_DB],
    models: [MODELS.USER, MODELS.SERVICE],
    factories: [FACTORIES.COMMANDS, FACTORIES.REDIS_OSCB, FACTORIES.DISPATCHER],
    services: [
        SERVICES.AUTH,
        SERVICES.CONFIG,
        SERVICES.ENV,
        SERVICES.SERVICE,
        SERVICES.REGISTRATION,
        SERVICES.EMAIL,
    ],
    defaultServiceName: process.env.SERVICE_NAME,
    defaultDomainName: 'local-mlc.ai',
});
