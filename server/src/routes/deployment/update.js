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
router.use(validateContentType('json'));
router.use(bodyParser.json());


router.post('/:name', authenticator, async (req, res) => {
    const deployDomain: DeploymentDomain = req.ioc.getDomain('deployment');
    const { name } = req.params;
    const [noFoundError, found] = await to(deployDomain.getDeploymentByName(name));
    if (!found || noFoundError) return res.status(statusCodes.NOT_FOUND).send(`${name} deployment not found.`);
    const [error, deployment] = await to(deployDomain.update(name, req.body));
    if (error) return res.status(statusCodes.INTERNAL_SERVER_ERROR).send();
    return res.status(statusCodes.OK).set('Content-Type', mimeTypes.lookup('json')).send(deployment);
});


router.use(jsonErrorHandler);
export default router;
