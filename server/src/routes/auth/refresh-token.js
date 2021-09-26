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

const refreshTokenVerificationCheck = [
    check('refresh-token').isLength({ min: 5 }),
];

router.post('/', refreshTokenVerificationCheck, async (req, res, next) => {
    const { token, body } = req;

    if (!token) {
        return res.status(statusCodes.UNAUTHORIZED).set('Content-Type', mimeTypes.lookup('json'));
    }
    const { 'refresh-token': refreshToken } = body;
    const authService: AuthService = req.ioc.getService('auth');
    try {
        const { token: newToken, refreshToken: newRefreshToken } = await authService.refreshToken({ token, refreshToken });
        return res.status(statusCodes.OK).set('Content-Type', mimeTypes.lookup('json')).send(JSON.stringify({
            token: newToken,
            refreshToken: newRefreshToken,
        }));
    } catch (e) {
        return next(boom.unauthorized('Refresh token or token is invalid.'));
    }
});


router.use(jsonErrorHandler);
export default router;
