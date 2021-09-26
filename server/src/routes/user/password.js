// @flow

import { Router } from 'express';
import bodyParser from 'body-parser';
import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';
import statusCodes from 'http-status-codes';

import type { Request, Response } from 'flow-typed/types';
import { check } from 'express-validator';
import validateContentType from 'src/middleware/validateContentType';
import UserDomain from 'src/domains/user';
import type { AuthService } from 'src/services/auth/AuthService';
import { authenticator } from 'src/middleware/express-jwt';

const router = Router();

router.use(validateContentType('json'));

router.use(bodyParser.json());

const validation = [
    check('email').optional({
        isEmail: true,
    }),
];

const passwordValidator = [
    check('password').isLength({ min: 5 }),
];

router.post('/forgot', validation, async (req: Request, res: Response) => {
    const { ioc, body: { email } } = req;
    const userDomain: UserDomain = ioc.getDomain('user');
    const user = await userDomain.getUserByEmail(email);
    if (!user) {
        return res.send('Sent');
    }
    const { _id: userId } = user;
    const registrationService = ioc.getService('registration');
    try {
        await registrationService.sendForgotPasswordEmail({ email, userId });
    } catch (e) {
        return res.status(statusCodes.SERVICE_UNAVAILABLE).send(JSON.stringify({ data: 'Problem sending email.' }));
    }
    return res.status(statusCodes.OK).send(JSON.stringify({ data: 'Email send successfully.' }));
});

router.post('/update', passwordValidator, authenticator, async (req: Request, res: Response) => {
    const {
        ioc, token, userId, body: { password },
    } = req;
    const userDomain: UserDomain = ioc.getDomain('user');
    const authService: AuthService = ioc.getService('auth');
    try {
        await userDomain.updateUserById(userId, { password });
        await authService.invalidateToken(token);
        return res.status(statusCodes.OK).send(JSON.stringify({ data: 'Password reset successfully' }));
    } catch (e) {
        return res.status(statusCodes.SERVICE_UNAVAILABLE).send(JSON.stringify({ data: 'Problem updating password.' }));
    }
});


router.use(jsonErrorHandler);

export default router;
