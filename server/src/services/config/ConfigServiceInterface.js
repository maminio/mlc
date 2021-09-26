// @flow

export type GatewayLinks = [
    {
        url: string,
        name: string
    }
]

export interface ConfigService {
    getClient(): string;

    getDomain(): string;

    getDBConnectionDetails(): {
        host: string,
        port: string,
        username: string,
        password: string,
        database: string,
    };

    getRedisConnectionDetails(): {
        host: string,
        port: string,
        password: string,
    };

    getJwtSecret(): string;

    getClientDomain(): string;

    getZookeeperConnectionDetails(): {
        host: string,
        port: string,
    };

    getKafkaConnectionDetails(): {
        host: string,
        port: string,
    };

    getCookieSecret(): string;

    getOpenfaasDetails(): {
        port: string,
        host: string,
    };

    getProvisionerDetails(): {
        port: string,
        host: string,
    };
}

export type Interface = ConfigService;
