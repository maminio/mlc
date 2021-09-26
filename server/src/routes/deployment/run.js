// @flow

import { Router } from 'express';
import bodyParser from 'body-parser';
import { check, validationResult } from 'express-validator';
import { find } from 'lodash';
import axios from 'axios';
import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';
import statusCodes from 'http-status-codes';
import mimeTypes from 'mime-types';
import validateContentType from 'src/middleware/validateContentType';
import { authenticator } from 'src/middleware/express-jwt';
import { to } from 'src/utils/promise';
import type { IoCContainer } from 'flow-typed/types';
import boom from '@hapi/boom';

const runDomain = (ioc: IoCContainer) => ioc.getDomain('run');
const deployDomain = (ioc: IoCContainer) => ioc.getDomain('deployment');
const openfaasService = (ioc: IoCContainer) => ioc.getService('openfaas');


const router = Router();
const OPENFAAS_URL = 'http://gateway.openfaas.svc.cluster.local:8080';
const CONFIGS = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const scaleOpenfaas = async  ({ name: functionName }) => {
    try {
        const { data } = await axios.get(`${OPENFAAS_URL}/system/functions`);
        const exists = find(data, { name: functionName });
         const res = await axios.post(`${OPENFAAS_URL}/system/scale-function/${functionName}`, {
            service: functionName, replicas: 5
        }, CONFIGS);
    } catch (e) {
        console.log( { e });
        return boom.internal('Problem updating openfaas functions.');
    }
}


router.post('/:deployment', bodyParser.json(), authenticator, async (req, res) => {
    const { ioc, body, userId } = req;
    const { deployment: deploymentName } = req.params;
    const [error, deployment] = await to(deployDomain(ioc).getDeploymentByName(deploymentName));
    if (error || !deployment) {
        return res.status(404).send('Deployment Not found');
    }
    const run = await runDomain(ioc).createRun({
        deployment: deployment._id,
        user: userId,
    });
    /* Call the Openfaas function */
    const functions = await openfaasService(ioc).getFunctions();
    const openfaasDeployed = find(functions, item => item.name === deploymentName);
    if (!openfaasDeployed) {
        return res.status(404).send('Deployment Not found or not deployed yet.');
    }
    return res.status(200).send({ result: 'run' });
});

router.get('/',
    authenticator,
    async (req, res) => {
    const { ioc, userId } = req;
    const [error, runs] = await to(runDomain(ioc).getRuns(userId));
    return res.status(200).send({ result: runs });
});

router.get('/status/:runId', authenticator, async (req, res) => {
    const { ioc, params: { runId } } = req;
    const [error, run] = await to(runDomain(ioc).getRunById(runId));
    return res.status(200).send({ result: run });
});


router.use(jsonErrorHandler);
export default router;
