// @flow

import unless from 'express-unless';
import boom from '@hapi/boom';
import { get } from 'lodash';
import type {
    Request, Response, ExpressNext, IoCContainer,
} from 'flow-typed/types';
import type { Interface as AuthService } from '../services/auth/AuthService';

export const calculateToken = (req: Request): string => {
    const authorization = get(req, 'headers.authorization');
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        let token = authorization.split(' ')[1];
        if (token && token.length > 0 && token[token.length - 1] === ',') {
            token = token.slice(0, -1);
        }
        return token;
    } if (get(req, 'query.token')) {
        return req.query.token;
    }
    return '';
};

export const validateToken = (ioc: IoCContainer, token: ?string): Promise<string> => new Promise((resolve, reject) => {
    if (!token) {
        return reject(boom.unauthorized('This endpoint requires JWT authentication'));
    }
    const authService: AuthService = ioc.getService('auth');
    return authService.isValid(token).then((isValid) => {
        if (!isValid) {
            return reject(boom.unauthorized('Token invalid or blacklisted'));
        }
        // $FlowIgnore
        return authService.getUserIDFromToken(token).then((userId) => {
            if (!userId) {
                return reject(boom.unauthorized('No user ID found on the token'));
            }
            return resolve(userId);
        });
    });
});

export const authenticator = async (req: Request, res: Response, next: ExpressNext) => {
    const { token, ioc } = req;
    console.log({ token });
    if (!token) {
        return next(boom.unauthorized('Token not valid.'));
    }
    const authService: AuthService = ioc.getService('auth');
    try {
        req.userId = await authService.isValid(token);
        console.log(' SIVA LID ');
        return next();
    } catch (e) {
        console.log(' FAILELD z');
        return next(boom.unauthorized('Token not valid.'));
    }
};

export default () => {
    const middleware = (req: Request, next: ExpressNext) => {
        const token: ?string = calculateToken(req);
        return validateToken(req.ioc, token)
            .then((userId) => {
                req.auth = {
                    userId,
                };
                return next();
            })
            .catch(error => next(error));
    };

    middleware.unless = unless;

    return middleware;
};
