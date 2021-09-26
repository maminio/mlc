// @flow

import { Router } from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';
import statusCodes from 'http-status-codes';
import mimeTypes from 'mime-types';
import boom from '@hapi/boom';

import { check } from 'express-validator';
import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';
import type { Interface as AuthService } from 'src/services/auth/AuthService';
import UserDomain from 'src/domains/user';



export default (app) => {
    const router = Router();
    router.use(bodyParser.json());

    const loginValidation = [
        check('username').optional({
            isLength: {
                min: 3,
            },
        }),
        check('password').optional({
            isLength: {
                min: 5,
            },
        }),
    ];

    router.post('/', loginValidation, async (req, res, next) => {
        if (typeof req.body !== 'object') {
            return next(boom.badRequest('Username and password or a token must be provided'));
        }
        const username = _.get(req, 'body.username', '').toLowerCase();
        const { password, token } = req.body;
        if ((typeof token === 'string' && token.trim().length > 0)
            || (typeof username === 'string' && typeof password === 'string'
                && username.trim().length > 0 && password.trim().length > 0)
        ) {
            const authService: AuthService = req.ioc.getService('auth');
            const userDomain: UserDomain = req.ioc.getDomain('user');
            if (token) {
                const isValid = await authService.isValid(token);
                if (isValid) {
                    const refreshToken = authService.generateRefreshToken({ token });
                    return res.status(statusCodes.OK)
                        .set('Content-Type', mimeTypes.lookup('json'))
                        .send({ token, refreshToken, redirect: '/' });
                }
                return res.status(statusCodes.FORBIDDEN)
                    .set('Content-Type', mimeTypes.lookup('json'))
                    .send({ token: null, refreshToken: null, redirect: '/' });
            }
            const user = await userDomain.getUserByUsernamePassword({ username, password });
            if (!user) {
                return res.status(statusCodes.NOT_FOUND).set('Content-Type', mimeTypes.lookup('json')).send(JSON.stringify({ data: 'USER_NOT_EXISTS' }));
            }
            const { token: newToken, refreshToken: newRefreshToken } = authService.generateTokenSet(user);

            return res.status(statusCodes.OK)
                .set('Content-Type', mimeTypes.lookup('json'))
                .send({ token: newToken, refreshToken: newRefreshToken, redirect: '/' });
        }
        return next(boom.badRequest('Email and password or a token must be provided'));
    });

    router.use(jsonErrorHandler);
    return router;
};
