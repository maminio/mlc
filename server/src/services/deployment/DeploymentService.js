// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';
import { factory, service } from 'mlc-ioc/lib/ioc/helpers';
import boom from '@hapi/boom';
import type { Interface as ConfigService } from '../config/ConfigService';
import Deployment from 'src/repositories/deployment/Deployment';
import { ProvisionNewServiceCommand } from 'src/commands/provisioner/ProvisionNewService';
import type { LogService } from 'flow-typed/ioc-service-logging';

export default class DeploymentService {
    constructor(
        configService: ConfigService,
        dispatcher,
        logger: LogService,
    ) {
        this.configService = configService;
        this.dispatcher = dispatcher;
        this.logger = logger;
    }


    async asyncDeploy(deployment: Deployment): Promise<boolean>{
        try {
            return await this.dispatcher.dispatch(new ProvisionNewServiceCommand(deployment));
        } catch (e) {
            this.logger.error('Error publish message to broker.');
            return boom.internal('Broker could not dispatch message.')
        }
    }

}

inversify.annotate(DeploymentService, [service('config'), factory('dispatcher'), service('logging'),]);
