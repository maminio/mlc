// @flow

import { Router } from 'express';
import type { RegistrationService } from 'src/services/registration/RegistrationService';
import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';
import type { Interface as AuthService } from 'src/services/auth/AuthService';
import statusCodes from 'http-status-codes';
import mimeTypes from 'mime-types';
import boom from '@hapi/boom';
import { authenticator } from 'src/middleware/express-jwt';
import UserDomain from 'src/domains/user'

const router = Router();

// @TODO add url params checking.

router.get('/email', async (req, res) => {
    const { token } = req.query;
    const registrationService: RegistrationService = req.ioc.getService('registration');
    const configService = req.ioc.getService('config');
    const newToken = await registrationService.verifyEmail(token);
    const url = `${configService.getStageClientUrl()}/user/login/verification?token=${newToken}`;
    res.redirect(url);
});


router.post('/resend', authenticator, async (req, res, next) => {
    const { token, userId } = req;
    // Injection
    const userDomain: UserDomain = req.ioc.getDomain('user');

    const { _id, email } = await userDomain.getUserById(userId);
    const registrationService: RegistrationService = req.ioc.getService('registration');

    await registrationService.resendVerificationEmail({ userId: _id, email, previousToken: token });
    return res.status(statusCodes.OK).set('Content-Type', mimeTypes.lookup('json')).send({ SUCCESS: true });
});

router.use(jsonErrorHandler);
export default router;
