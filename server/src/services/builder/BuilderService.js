// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';
import { factory, service } from 'mlc-ioc/lib/ioc/helpers';
import axios from 'axios';
import boom from '@hapi/boom';
import { find } from 'lodash';
import Deployment from 'src/repositories/deployment/Deployment';
import { to } from 'src/utils/promise';
import { ProvisionStatusUpdateCommand } from 'src/commands/provisioner/ProvisionStatusUpdate';
import { ProvisionStatus } from 'src/models/deployment';
import type { Interface as ConfigService } from '../config/ConfigService';
import { constructDockerfile } from './dockerfile-builder';

const OPENFAAS_URL = 'http://gateway.openfaas.svc.cluster.local:8080';
const CONFIGS = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const constructFileName = ({ path, fileType }: {path: string, fileType: string }) => {
    if (!path || !path.split('/')[1]) throw new Error('File path not valid');
    return path.split('/')[1] + fileType;
};

export default class BuilderService {
    constructor(
        configService: ConfigService,
        dispatcher,
    ) {
        this.configService = configService;
        this.dispatcher = dispatcher;
    }

    async dispatchMessageUpdates(data) {
        try {
            await this.dispatcher.dispatch(new ProvisionStatusUpdateCommand(data));
        } catch (e) {
            console.log({ e });
        }
    }

    /**
 *Check if the function name already exists then PUT the function for an update. Otherwise create a new one.
 * */
    static async handleOpenfaasFunction(body) {
        try {
            const { data } = await axios.get(`${OPENFAAS_URL}/system/functions`);
            const exists = find(data, { name: body.service });
            console.log({ exists });
            if (exists) {
                return await axios.put(`${OPENFAAS_URL}/system/functions`, body, CONFIGS);
            }
            return await axios.post(`${OPENFAAS_URL}/system/functions`, body, CONFIGS);
        } catch (e) {
            return boom.internal('Problem updating openfaas functions.');
        }
    }

    /**
 *Check if the function name already exists then PUT the function for an update. Otherwise create a new one.
 * */
    static async scaleOpenfaas(functionName) {
        try {
            const { data } = await axios.get(`${OPENFAAS_URL}/system/functions`);
            const exists = find(data, { name: functionName });
            console.log({ exists, data });

            return await axios.post(`${OPENFAAS_URL}/system//system/scale-function/${functionName}`, {}, CONFIGS);
        } catch (e) {
            return boom.internal('Problem updating openfaas functions.');
        }
    }

    async deploy(deployment: Deployment): Promise<boolean> {
        const { name, model } = deployment;
        await this.dispatchMessageUpdates({ status: { current: ProvisionStatus.INITIALIZING } });
        const image = 'eu.gcr.io/rectified-259021/inference-base:dev21';
        await this.dispatchMessageUpdates({ status: { current: ProvisionStatus.INSTALLING_PACKAGES }, image });
        const body = {
            service: name,
            network: 'func_functions',
            image,
            registryAuth: 'YWRtaW46YWRtaW4=',
            annotations: {
                deploymentId: deployment._id,
            },
            envVars: {
                DEPLOYMENT_ID: deployment._id,
                DEPLOYMENT_REQUIREMENT_FILE: deployment.package.requirements_file,
                DEPLOYMENT_MODEL_PATH: deployment.model.path,
                DEPLOYMENT_MODEL_FILETYPE: deployment.model.fileType,
                DEPLOYMENT_MODEL_NAME: deployment.name,
            },
        };
        /* Check if the function already exist, update it or send a message prior to building the image. */
        await BuilderService.handleOpenfaasFunction(body);
        await this.dispatchMessageUpdates({ status: { current: ProvisionStatus.DEPLOYED } });
    }
}

inversify.annotate(BuilderService, [service('config'), factory('dispatcher')]);
