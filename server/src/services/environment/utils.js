// @flow

import boom from 'boom';

import type {Map} from 'flow-typed/types';

export const getProcessEnvironmentVariables = (): Map<string, ?string> => process.env;

export const isDevelopment = (appEnv: string): boolean =>
    appEnv === 'development' || appEnv === 'dev';

export const isTesting = (appEnv: string): boolean =>
    appEnv === 'testing';

export const isStaging = (appEnv: string): boolean =>
    appEnv === 'staging';

export const isProduction = (appEnv: string): boolean =>
    appEnv === 'production' || appEnv === 'prod';

export const isAWS = (isAwsEnv: string): boolean =>
    `${isAwsEnv}` === 'true';

export const isLocal = (isAwsEnv: string): boolean =>
    !isAWS(isAwsEnv);

export const getEnvironmentVariable = (environment: {}, key: string, defaultValue: ?string): string => {
    if (typeof environment !== 'object') {
        throw boom.internal('No environment values have been set');
    }
    const value = environment[key];

    if (typeof value !== 'undefined') {
        return value;
    }
    if (typeof defaultValue === 'string') {
        return defaultValue;
    }
    throw boom.internal(`No environment value for the key '${key}'`);
};

