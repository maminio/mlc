// @flow
import server from 'micro-services/utils/BaseServer';
import {
    CONNECTORS, SERVICES, FACTORIES, MODELS, REPOSITORIES
} from 'micro-services/utils/modules';
import middlewares from './middlewares';
import controllers from './controllers';
import GeneralEvenProcessor from 'src/processors/GeneralEvenProcessor';

export default port => server({
    controllers,
    middlewares,
    port,
    connectors: [CONNECTORS.MONGO_DB],
    repositories: [
        REPOSITORIES.USER,
        REPOSITORIES.DEPLOYMENT,
        REPOSITORIES.RUN,
    ],
    factories: [FACTORIES.COMMANDS, FACTORIES.REDIS_OSCB, FACTORIES.DISPATCHER],
    services: [
        SERVICES.AUTH,
        SERVICES.CONFIG,
        SERVICES.ENV,
        SERVICES.REGISTRATION,
        SERVICES.DEPLOYMENT,
        SERVICES.OPENFAAS,
    ],

    defaultServiceName: process.env.SERVICE_NAME,
    defaultDomainName: 'local-mlc.ai',
    consumers: (configService: ConfigService) => [
        GeneralEvenProcessor('api-service', [
            'provisioning',
            'api-provisioner-stream',
            'run-stream',
        ]),
    ],
});
