// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';

import { constant, service } from 'mlc-ioc/lib/ioc/helpers';
import type { Interface as ConfigServiceInterface } from './ConfigServiceInterface';
import type { Interface as EnvironmentService } from '../environment/EnvironmentService';
import { EnvVars } from '../environment/EnvVars';

export default class ConfigService implements ConfigServiceInterface {
    clientName: string;

    domainName: string;

    envirionmentService: EnvironmentService;

    constructor(clientName: string, domainName: string, envirionmentService: EnvironmentService) {
        this.clientName = clientName;
        this.domainName = domainName;
        this.envirionmentService = envirionmentService;
    }

    getClient(): string {
        return this.clientName;
    }

    getDomain(): string {
        return this.domainName;
    }

    getDBConnectionDetails(): {
        host: string,
        port: string,
        username: string,
        password: string,
        database: string,
    } {
        return {
            host: this.envirionmentService.getEnvironmentVariable(EnvVars.DB_HOST),
            port: this.envirionmentService.getEnvironmentVariable(EnvVars.DB_PORT),
            username: this.envirionmentService.getEnvironmentVariable(EnvVars.DB_USER),
            password: this.envirionmentService.getEnvironmentVariable(EnvVars.DB_PASS),
            database: this.envirionmentService.getEnvironmentVariable(EnvVars.DB_NAME),
        };
    }

    getRedisConnectionDetails(): {
        host: string,
        port: string,
        password: string,
    } {
        return {
            host: this.envirionmentService.getEnvironmentVariable(EnvVars.REDIS_HOST),
            port: this.envirionmentService.getEnvironmentVariable(EnvVars.REDIS_PORT),
            password: this.envirionmentService.getEnvironmentVariable(EnvVars.REDIS_PASS),
        };
    }

    getJwtSecret(): string {
        return `${this.envirionmentService.getEnvironmentVariable(EnvVars.JWT_SECRET)}`;
    }

    getZookeeperConnectionDetails(): {
        host: string,
        port: string,
    } {
        return {
            host: this.envirionmentService.getEnvironmentVariable(EnvVars.ZOOKEEPER_HOST, ''),
            port: this.envirionmentService.getEnvironmentVariable(EnvVars.ZOOKEEPER_PORT, ''),
        };
    }

    getKafkaConnectionDetails(): {
        host: string,
        port: string,
    } {
        return {
            host: this.envirionmentService.getEnvironmentVariable(EnvVars.KAFKA_HOST, ''),
            port: this.envirionmentService.getEnvironmentVariable(EnvVars.KAFKA_PORT, ''),
        };
    }

    getCookieSecret(): string {
        return this.envirionmentService.getEnvironmentVariable(EnvVars.COOKIE_SECRET);
    }

    getStorageServiceURL(): string {
        return this.envirionmentService.getEnvironmentVariable(EnvVars.STORAGE_SERVICE_URL);
    }

    getStageClientUrl(): string {
        return `https://${this.envirionmentService.getEnvironmentVariable(EnvVars.STAGING_ENDPOINT_SUBDOMAIN)}console${this.envirionmentService.getEnvironmentVariable(EnvVars.STAGING_ENDPOINT_STAGE)}.${this.envirionmentService.getEnvironmentVariable(EnvVars.DOMAIN_NAME)}`;
    }

    getOpenfaasDetails(): string {
        return {
            host: this.envirionmentService.getEnvironmentVariable(EnvVars.OPENFAAS_HOST),
            port: this.envirionmentService.getEnvironmentVariable(EnvVars.OPENFAAS_PORT),
        };
    }

    getProvisionerDetails(): string {
        return {
            host: this.envirionmentService.getEnvironmentVariable(EnvVars.PROVISIONER_SERVICE_URL),
            port: this.envirionmentService.getEnvironmentVariable(EnvVars.PROVISIONER_SERVICE_PORT),
        };
    }

    getUserTopic(): string {
        return `${this.envirionmentService.getEnvironmentVariable(EnvVars.USER_TOPIC)}`;
    }

    getProvisionerTopic(): string {
        return `${this.envirionmentService.getEnvironmentVariable(EnvVars.PROVISIONER_TOPIC)}`;
    }

    getProvisionerLogStreamTopic(): string {
        return `${this.envirionmentService.getEnvironmentVariable(EnvVars.PROVISIONER_LOGSTREAM_TOPIC)}`;
    }
}

inversify.annotate(ConfigService, [
    constant('service-name'),
    constant('domain-name'),
    service('environment'),
]);
