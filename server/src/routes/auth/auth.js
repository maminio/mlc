// @flow

import { Router } from 'express';
import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';
import type { Interface as AuthService } from 'src/services/auth/AuthService';
import statusCodes from 'http-status-codes';
import mimeTypes from 'mime-types';
import bodyParser from 'body-parser';
import validateContentType from 'src/middleware/validateContentType';

const router = Router();
router.use(validateContentType('json'));
router.use(bodyParser.json());


router.post('/', async (req, res) => {
    const { token } = req;
    if (!token) {
        return res.status(statusCodes.UNAUTHORIZED).set('Content-Type', mimeTypes.lookup('json'));
    }
    const authService: AuthService = req.ioc.getService('auth');
    const { userId: _id, isValid, isVerified } = authService.decodeToken(token);
    const { token: newToken, refreshToken } = authService.generateTokenSet(
        {
            _id,
            isVerified,
            isValid,
        },
    );
    return res.status(statusCodes.OK)
        .set('Content-Type', mimeTypes.lookup('json'))
        .send({ token: newToken, redirect: '/', refreshToken });
});


router.use(jsonErrorHandler);
export default router;
