// @flow

import User from 'src/domains/user/User'

export interface AuthService {
    renewToken(token: string): Promise<string>;

    validateUserCredentials({ id?: string, email?: string, password: string }): Promise<string>;

    setUserPassword(userId: string, password: string): Promise<void>;

    generateToken({
                      accessToken?: string,
                      id?: string,
                      displayName?: string,
                      provider?: string,
                      email?: string,
                      isVerified: boolean,
                  }): Promise<string>;

    isValid(token: string): Promise<boolean>;

    invalidateToken(token: string): Promise<void>;

    refreshToken({ token: string, refreshToken: string }): Promise<string>;

    generateRefreshToken({ token: string }): string;

    generateTokenSet({ _id: string, isValid: boolean, isVerified: boolean }): string;

    hasBeenInvalidated(token: string): Promise<boolean>;

    getUserIDFromToken(token: string): Promise<string>;

    getUserExistence({ providerUserId: string, emails: string, provider: string }): Promise<Object>;

    decodeToken(token: string): Promise<Object>;

    verifyToken(token: string): Promise<Object>;

    getUserByEmailPassword({ email: string, password: string }): Promise<Object>;

    getUserById(userId: string): Promise<User>;

    getUserIdByToken(token: string): Promise<String>;

    generateContextualToken(payload: any): String;
}

export type Interface = AuthService;
