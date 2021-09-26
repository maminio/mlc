// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';
import { model } from 'mlc-ioc/lib/ioc/helpers';
import $ from 'mongo-dot-notation';
import type { Interface as Deployment } from '../../models/deployment';

export default class DeploymentRepository {
    DeploymentModel: Deployment;

    constructor(deploymentModel: Deployment) {
        this.DeploymentModel = deploymentModel;
    }

    /**
     * Get deployments
     *
     * @memberof DeploymentRepository
     * @returns {Promise<Deployment[]>}
     */
    getDeployments(owner: string): Promise<Deployment[]> {
        return this.DeploymentModel.find({ owner });
    }

    /**
     * Get an deployment by ID
     *
     * @memberof DeploymentRepository
     * @param {string} deploymentId - the Id of the deployment
     * @returns {Promise<Deployment>}
     */
    getDeploymentById(deploymentId: string): Promise<Deployment> {
        return this.DeploymentModel.findById(deploymentId);
    }

    /**
     * Get an deployment by name
     *
     * @memberof DeploymentRepository
     * @param {string} name - the Id of the deployment
     * @returns {Promise<Deployment>}
     */
    getDeploymentByName(name: string): Promise<Deployment> {
        return this.DeploymentModel.findOne({ name });
    }


    /**
     * Update deployment info by Name
     * @param {string} deploymentName - the deployment's NAME
     * @param {object} params - the deployment's attributes.
     * @returns {Promise<Deployment>}
     */
    updateDeploymentByName(deploymentName: string, params: Object): Promise<Deployment> {
        return this.DeploymentModel.findOneAndUpdate({ name: deploymentName }, $.flatten(params), { new: true });
    }


    /**
     * Create deployment.
     * @param {object} params - the deployment' parameters
     * @returns {Promise<Deployment>}
     */
    createDeployment(params): Promise<Deployment> {
        return this.DeploymentModel.create(params);
    }
}


inversify.annotate(
    DeploymentRepository,
    [
        model('deployment'),
    ],
);
