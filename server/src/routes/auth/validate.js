// @flow

import { Router } from 'express';
import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';
import type { Interface as AuthService } from 'src/services/auth/AuthService';
import statusCodes from 'http-status-codes';
import mimeTypes from 'mime-types';
import bodyParser from 'body-parser';
import validateContentType from 'src/middleware/validateContentType';
import { check } from 'express-validator';
import boom from '@hapi/boom';

const router = Router();
router.use(validateContentType('json'));
router.use(bodyParser.json());



router.post('/', async (req, res, next) => {
    const { token } = req;
    if (!token) {
        return res.status(statusCodes.UNAUTHORIZED).set('Content-Type', mimeTypes.lookup('json'));
    }
    const authService: AuthService = req.ioc.getService('auth');
    const isValid = await authService.isValid(token);
    if (isValid) {
        return res.status(statusCodes.OK).set('Content-Type', mimeTypes.lookup('json')).send({ token, redirect: '/' });
    }
    return res.status(statusCodes.UNAUTHORIZED).set('Content-Type', mimeTypes.lookup('json')).send();
});


router.use(jsonErrorHandler);
export default router;
