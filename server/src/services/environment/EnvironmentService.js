// @flow

import type {EnvVar} from './EnvVars';

export interface EnvironmentService {
    appVersion(): string;

    appEnvironment(): string;

    awsRegion(): string;

    isDevelopment(): boolean;

    isTesting(): boolean;

    isProduction(): boolean;

    getEnvironmentVariable(key: EnvVar, defaultValue: ?string): string;
}

export type Interface = EnvironmentService;
