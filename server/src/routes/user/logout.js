// @flow

import { Router } from 'express';
import boom from '@hapi/boom';
import statusCodes from 'http-status-codes';
import bodyParser from 'body-parser';

import type { Interface as AuthService } from 'src/services/auth/AuthService';
import validateContentType from 'src/middleware/validateContentType';
import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';

const router = Router();

router.use(validateContentType('json'));

router.use(bodyParser.json());

router.post('/', (req, res, next) => {
    if (typeof req.body !== 'object') {
        return next(boom.badRequest('Token must be provided'));
    }

    const { token } = req;

    if (typeof token !== 'string') {
        return next(boom.badRequest('Token must be provided'));
    }

    try {
        const authService: AuthService = req.ioc.getService('auth');
        return authService.invalidateToken(token).then(() => res.status(statusCodes.NO_CONTENT).send(''));
    } catch (err) {
        return next(boom.badRequest(err.message));
    }
});

router.use(jsonErrorHandler);

export default router;
