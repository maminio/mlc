// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';
import 'reflect-metadata'; // must be here so we can use reflect metadata when adding new services
import { repository, service } from 'mlc-ioc/lib/ioc/helpers';
import type { LogService } from 'flow-typed/ioc-service-logging';
import type { Interface as Deployment } from '../../models/deployment';
import DeploymentRepository from '../../repositories/deployment';

class DeploymentDomain {
    deploymentRepository: DeploymentRepository;

    logger: LogService

    constructor(deploymentRepository: DeploymentRepository, logger: LogService) {
        this.deploymentRepository = deploymentRepository;
        this.logger = logger;
    }

    create(params: Deployment): Promise<Deployment> {
        try {
            return this.deploymentRepository.createDeployment(params);
        } catch (error) {
            this.logger.error('Error creating deployments.', { error });
            return null;
        }
    }

    update(deploymentName: string, params: Deployment): Promise<Deployment> {
        try {
            return this.deploymentRepository.updateDeploymentByName(deploymentName, params);
        } catch (error) {
            this.logger.error('Error creating deployments.', { error });
            return null;
        }
    }


    getDeployments(owner: string): Promise<Deployment[]> {
        try {
            return this.deploymentRepository.getDeployments(owner);
        } catch (error) {
            this.logger.error('Error reading deployments.', { error });
            return null;
        }
    }

    getDeploymentByName(name: string): Promise<Deployment[]> {
        try {
            return this.deploymentRepository.getDeploymentByName(name);
        } catch (error) {
            this.logger.error('Error reading deployments.', { error });
            return null;
        }
    }

    getDeploymentById(Id: string): Promise<Deployment[]> {
        try {
            return this.deploymentRepository.getDeploymentById(Id);
        } catch (error) {
            this.logger.error('Error reading deployments.', { error });
            return null;
        }
    }
}

inversify.annotate(
    DeploymentDomain,
    [
        repository('deployment'),
        service('logging'),
    ],
);

export default DeploymentDomain;
