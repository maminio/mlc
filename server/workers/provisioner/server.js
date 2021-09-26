// @flow

import {
    CONNECTORS, SERVICES, MODELS, FACTORIES,
} from 'micro-services/utils/modules';
import GeneralEvenProcessor from 'src/processors/GeneralEvenProcessor';
import type { ConfigService } from 'src/services/config/ConfigServiceInterface';
import server from '../utils/workerRunner';

// Control Plane
export default () => server({
    connectors: [],
    repositories: [],
    services: [
        SERVICES.AUTH,
        SERVICES.CONFIG,
        SERVICES.ENV,
        SERVICES.OPENFAAS,
        SERVICES.BUILDER,
    ],
    factories: [FACTORIES.COMMANDS, FACTORIES.REDIS_OSCB, FACTORIES.DISPATCHER],

    defaultServiceName: process.env.SERVICE_NAME,
    defaultDomainName: 'local-mlc.ai',
    consumers: () => [
        GeneralEvenProcessor('provisioner-worker', [
            'worker-provisioner-stream'
        ]),
    ],
});
