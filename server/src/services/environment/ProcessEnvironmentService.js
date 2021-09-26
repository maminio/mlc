// @flow

import {helpers as inversify} from 'inversify-vanillajs-helpers';
import path from 'path';
import fs from 'fs';

import {EnvVars} from './EnvVars';
import {
    getEnvironmentVariable,
    isDevelopment,
    isProduction,
    isStaging,
    isTesting,
    getProcessEnvironmentVariables,
    isLocal,
    isAWS
} from './utils';

import type {EnvironmentService} from './EnvironmentService';
import type {EnvVar} from './EnvVars';

const EU_LONDON_REGION = 'eu-west-2';
const VERSION_FILE = '.version';
const UNKNOWN_VERSION = '00000000';
const UNKNOWN_ENV = 'unknown';

const isFile = dirPath => fs.existsSync(dirPath) && fs.statSync(dirPath).isFile();

export default class ProcessEnvironmentService implements EnvironmentService {
    environment: {};
    _appVersion: ?string = null;

    constructor() {
        this.environment = Object.assign({}, getProcessEnvironmentVariables());
        this._appVersion = null;
        try {
            const versionFilePath = path.resolve(__dirname, `../../../${VERSION_FILE}`);
            if (isFile(versionFilePath)) {
                const appVersion = fs.readFileSync(versionFilePath, 'UTF-8').trim();
                this._appVersion = appVersion.split(/\r?\n/)[0].trim(); // only use the first line
            }
        } catch (e) {
            /* ignore the error, _appVersion defaults to null and we'll then read from an environment variable */
        }
    }

    appVersion(): string {
        return this._appVersion || this.getEnvironmentVariable(EnvVars.APP_VERSION, UNKNOWN_VERSION);
    }

    appEnvironment(): string {
        return this.getEnvironmentVariable(EnvVars.NODE_ENV, UNKNOWN_ENV);
    }

    awsRegion(): string {
        return this.getEnvironmentVariable(EnvVars.AWS_REGION, EU_LONDON_REGION);
    }

    isDevelopment(): boolean {
        return isDevelopment(this.appEnvironment());
    }

    isTesting(): boolean {
        return isTesting(this.appEnvironment());
    }

    isStaging(): boolean {
        return isStaging(this.appEnvironment());
    }

    isProduction(): boolean {
        return isProduction(this.appEnvironment());
    }

    isAWS(): boolean {
        const isAWSEnv = this.getEnvironmentVariable(EnvVars.IS_AWS, '');
        return isAWS(isAWSEnv);
    }

    isLocal(): boolean {
        const isAWSEnv = this.getEnvironmentVariable(EnvVars.IS_AWS, '');
        return isLocal(isAWSEnv);
    }

    getEnvironmentVariable(key: EnvVar, defaultValue: ?string): string {
        return getEnvironmentVariable(this.environment, key, defaultValue);
    }
}

inversify.annotate(ProcessEnvironmentService, []);
