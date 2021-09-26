// @flow

import { Router } from 'express';
import bodyParser from 'body-parser';
import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';
import statusCodes from 'http-status-codes';
import mimeTypes from 'mime-types';
import validateContentType from 'src/middleware/validateContentType';
import DeploymentDomain from 'src/domains/deployment';
import { to } from 'src/utils/promise';
import { find } from 'lodash';
import axios from 'axios';
import boom from '@hapi/boom';

const { exec } = require('child_process');
const k8s = require('@kubernetes/client-node');

const OPENFAAS_URL = 'http://gateway.openfaas.svc.cluster.local:8080';
const CONFIGS = {
    headers: {
        'Content-Type': 'application/json',
    },
};
const router = Router();
router.use(validateContentType('json'));
router.use(bodyParser.json());


router.post('/:deploymentId', async (req, response) => {
    /**
     1. Find pod
     2. Find container
     3. Commit container
     4. Update openfaas container
     */
    const { params: { deploymentId } } = req;
    const deployDomain: DeploymentDomain = req.ioc.getDomain('deployment');
    const [noFoundError, deployment] = await to(deployDomain.getDeploymentById(deploymentId));
    if (!deployment || noFoundError) return response.status(statusCodes.NOT_FOUND).send(`${deploymentId} deployment not found.`);
    try {
        const dockerScript = exec('bash src/routes/deployment/docker-ps.sh');
        let dockerPs;
        await new Promise((resolve, reject) => {
            dockerScript.stdout.on('data', (data) => {
                dockerPs = JSON.parse(data);
            });
            dockerScript.stderr.on('data', (data) => {
                // reject();
            });
            dockerScript.on('exit', async (data) => {
                resolve(data);
            });
        });
        const container = find(dockerPs, item => item.Names.includes(deployment.name) && !item.Names.includes('POD'));
        if (!container) return boom.internal('Internal error on commiting container. Container not found.');
        const newContainerName = `${deployment.name}-${deployment._id}:${new Date().getTime()}`;
        const dockerCommit = exec(`bash src/routes/deployment/docker-commit.sh ${container.ID} ${newContainerName}`);
        await new Promise((resolve, reject) => {
            dockerCommit.stdout.on('data', (data) => {
                console.log({ data });
            });
            dockerCommit.stderr.on('data', data => reject());
            dockerCommit.on('exit', async (data) => {
                resolve(data);
            });
        });
        try {
            await axios.put(`${OPENFAAS_URL}/system/functions`, {
                service: deployment.name,
                image: newContainerName,
            }, CONFIGS);
        } catch (e) {
            console.log({ e });
            return boom.internal('Problem updating openfaas functions.');
        }
    } catch (e) {
        return boom.internal('Internal error on commiting container');
    }
});


router.use(jsonErrorHandler);
export default router;
