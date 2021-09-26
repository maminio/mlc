// @flow

import { Router } from 'express';
import bodyParser from 'body-parser';
import { check, validationResult } from 'express-validator';

import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';
import statusCodes from 'http-status-codes';
import mimeTypes from 'mime-types';
import validateContentType from 'src/middleware/validateContentType';
import DeploymentDomain from 'src/domains/deployment';
import { authenticator } from 'src/middleware/express-jwt';
import { to } from 'src/utils/promise';


const router = Router();


router.get('/', authenticator, async (req, res) => {
    const deployDomain: DeploymentDomain = req.ioc.getDomain('deployment');
    const { userId: owner } = req;
    const [error, deployments] = await to(deployDomain.getDeployments(owner));
    if (error) return res.status(statusCodes.INTERNAL_SERVER_ERROR).send();
    return res.status(statusCodes.OK).set('Content-Type', mimeTypes.lookup('json')).send(deployments);
});

router.get('/:name', authenticator, async (req, res) => {
    const deployDomain: DeploymentDomain = req.ioc.getDomain('deployment');
    const { params: { name } } = req;
    const [error, deployments] = await to(deployDomain.getDeploymentByName(name));
    if (error) return res.status(statusCodes.INTERNAL_SERVER_ERROR).send();
    return res.status(statusCodes.OK).set('Content-Type', mimeTypes.lookup('json')).send(deployments);
});

router.get('/:id', async (req, res) => {
    const deployDomain: DeploymentDomain = req.ioc.getDomain('deployment');
    const { params: { id } } = req;
    const [error, deployments] = await to(deployDomain.getDeploymentById(id));
    if (error) return res.status(statusCodes.INTERNAL_SERVER_ERROR).send();
    return res.status(statusCodes.OK).set('Content-Type', mimeTypes.lookup('json')).send(deployments);
});


router.use(jsonErrorHandler);
export default router;
