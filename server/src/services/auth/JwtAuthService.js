// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';
import jwt from 'jsonwebtoken';
import boom from '@hapi/boom';
import uuid from 'uuid';

import { service, factory } from 'mlc-ioc/lib/ioc/helpers';
import type { Interface as ConfigService } from 'src/services/config/ConfigService';
import type { Interface as RedisOrderedSetCommandBuilder } from 'src/factories/redis-ordered-set-commands-builder';
import type { Interface as AuthService } from './AuthService';

const TOKEN_EXPIRY_TIME = '5h';
const REFRESH_TOKEN_EXPIRY_TIME = '24h';
const BLACKLIST_KEY = 'st_jwt_blacklist';

export type TokenPayload = {
    userId: string,
    provider: any,
    isVerified: boolean,
    sub: string,
    upn: string,
    isValid: boolean,
}

export type RefreshTokenPayload = {
    userId: string,
    token: string,
}

export type TokenSet = {
    token: string,
    refreshToken: string,
}

export default class JwtAuthService implements AuthService {
    configService: ConfigService;

    redisOrderedSetCommandBuilder: RedisOrderedSetCommandBuilder;

    constructor(
        configService: ConfigService,
        redisOrderedSetCommandBuilder: RedisOrderedSetCommandBuilder,
        logger,
    ) {
        this.configService = configService;
        this.redisOrderedSetCommandBuilder = redisOrderedSetCommandBuilder;
        this.logger = logger;
    }

    async renewToken(token: string): Promise<string> {
        // TODO Add token validation before renewing
        const tokenIsValid = await this.isValid(token);
        if (tokenIsValid) {
            const decodedToken = jwt.verify(token, this.configService.getJwtSecret());
            return jwt.sign(
                {
                    userId: decodedToken.userId,
                    isVerified: decodedToken.isVerified,
                },
                this.configService.getJwtSecret(),
                {
                    expiresIn: TOKEN_EXPIRY_TIME,
                    notBefore: 0,
                    jwtid: uuid.v4(),
                },
            );
        }
        throw boom.badRequest('token not valid');
    }

    async refreshTokenIsValid(token: string): Promise<boolean> {
        try {
            jwt.verify(token, this.configService.getJwtSecret());
        } catch (error) {
            return Promise.resolve(false);
        }
        const hasBeenInvalidated = await this.hasBeenInvalidated(token);
        return Promise.resolve(!hasBeenInvalidated);
    }

    async isValid(token: string): Promise<boolean> {
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, this.configService.getJwtSecret());
        } catch (error) {
            return Promise.reject(false);
        }
        if (!decodedToken.isValid) {
            return Promise.resolve(false);
        }

        return Promise.resolve(decodedToken.userId);
    }

    getUserIDFromToken(token: string): Promise<string> {
        return Promise.resolve(jwt.decode(token, this.configService.getJwtSecret()).userId);
    }


    async invalidateToken(token: string): Promise<string> {
        if (typeof token !== 'string' || token.length === 0) {
            throw new TypeError('token must be a string');
        }
        // const decodedToken = jwt.decode(token, this.configService.getJwtSecret());
        // @TODO should we check for token validation here ?
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, this.configService.getJwtSecret());
        } catch (error) {
            return Promise.resolve('Already invalid');
        }
        try {
            await this.redisOrderedSetCommandBuilder()
                .put(BLACKLIST_KEY, token, decodedToken.exp)
                .removeOldEntries(BLACKLIST_KEY)
                .run();
        } catch (e) {
            console.log({ e });
        }

        return Promise.resolve('Token invalidated');
    }

    async hasBeenInvalidated(token: string): Promise<boolean> {
        if (typeof token !== 'string' || token.length === 0) {
            throw new TypeError('token must be a string');
        }
        const [blacklistValue] = await this.redisOrderedSetCommandBuilder()
            .value(BLACKLIST_KEY, token)
            .run();
        return !!blacklistValue;
    }


    async decodeToken(token: string): Promise<Object> {
        return jwt.decode(token, this.configService.getJwtSecret());
    }


    async verifyToken(token: string): Promise<Object> {
        return jwt.verify(token, this.configService.getJwtSecret());
    }


    generateToken({
        _id, isVerified, isValid = true,
    }: { _id?: string, isVerified: string, isValid: boolean }) {
        return jwt.sign(
            {
                userId: _id,
                isVerified,
                sub: '',
                upn: _id,
                isValid,
            },
            this.configService.getJwtSecret(),
            {
                expiresIn: TOKEN_EXPIRY_TIME,
                notBefore: 0,
                jwtid: uuid.v4(),
            },
        );
    }

    generateTokenSet({ _id, isVerified, isValid }: { _id: string, isVerified: boolean, isValid: boolean }): TokenSet {
        const token = this.generateToken({ _id, isVerified, isValid });
        const refreshToken = this.generateRefreshToken({ token });
        return { token, refreshToken };
    }

    generateRefreshToken({ token }: { token: string }) {
        const { userId } = this.decodeToken(token);
        return jwt.sign({
            userId,
            token,
        },
        this.configService.getJwtSecret(),
        {
            expiresIn: REFRESH_TOKEN_EXPIRY_TIME,
            notBefore: 0,
            jwtid: uuid.v4(),
        });
    }

    async refreshToken({ token, refreshToken }: { token: string, refreshToken: string }): Promise<string> {
        const isTokenValid = await this.refreshTokenIsValid(refreshToken);
        const refreshTokenPayload = jwt.decode(refreshToken, this.configService.getJwtSecret());
        if (isTokenValid && refreshTokenPayload.token === token) {
            const tokenPayload = jwt.decode(token, this.configService.getJwtSecret());
            // @TODO Hot fix made, try to fix generate token and its input params.
            tokenPayload._id = tokenPayload.userId;
            const newToken = this.generateToken(tokenPayload);
            const newRefreshToken = this.generateRefreshToken({ token: newToken });
            return Promise.resolve({
                token: newToken,
                refreshToken: newRefreshToken,
            });
        }
        return Promise.reject(new Error('Refresh token is invalid!'));
    }


    async getUserIdByToken(token: string) {
        try {
            const { userId } = jwt.verify(token, this.configService.getJwtSecret());
            return userId;
        } catch (e) {
            return null;
        }
    }

    // This function is used as a temporary token generation for third-party auth.
    generateContextualToken(payload) {
        return jwt.sign(
            payload,
            this.configService.getJwtSecret(),
            {
                expiresIn: TOKEN_EXPIRY_TIME,
                notBefore: 0,
                jwtid: uuid.v4(),
            },
        );
    }
}

inversify.annotate(JwtAuthService, [service('config'), factory('redis-oscb'), service('logging')]);
