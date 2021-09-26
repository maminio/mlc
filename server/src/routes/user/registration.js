// @flow

import { Router } from 'express';
import bodyParser from 'body-parser';
import { check, validationResult } from 'express-validator';


import type { RegistrationService } from 'src/services/registration/RegistrationService';
import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';
import statusCodes from 'http-status-codes';
import mimeTypes from 'mime-types';
import validateContentType from 'src/middleware/validateContentType';
import UserDomain from 'src/domains/user';
import type { AuthService } from 'src/services/auth/AuthService';


const router = Router();
router.use(validateContentType('json'));
router.use(bodyParser.json());
const registrationValidation = [
    check('username').isLength({ min: 3 }),
    check('password').isLength({ min: 5 }),
];
router.post('/', registrationValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const userDomain: UserDomain = req.ioc.getDomain('user');
    const registrationService: RegistrationService = req.ioc.getService('registration');
    const authService: AuthService = req.ioc.getService('auth');
    const {
        username, password,
    } = req.body;
    const user = await userDomain.getUserByUsername(username);
    if (user) {
        return res.status(statusCodes.CONFLICT).json({ data: 'USER_ALREADY_EXISTS' });
    }

    const newUser = await registrationService.createNewUser({
        username, password,
    });

    const { token, refreshToken } = authService.generateTokenSet(newUser);

    return res.status(statusCodes.OK).set('Content-Type', mimeTypes.lookup('json')).send({ token, refreshToken, redirect: '/' });
});


router.use(jsonErrorHandler);
export default router;
