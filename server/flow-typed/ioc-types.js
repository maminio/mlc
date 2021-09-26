// @flow

export interface ErrorReportingService {

    reportError(error: Error): void;

}


export type IoCAutoBindingParams = {
    isDevelopment: boolean,
    isTesting: boolean,
    isStaging: boolean,
    isProduction: boolean,
    isLocal: boolean,
    isAWS: boolean,
};

export type App = any;

export type IoCContainer = any;

export type CLSNamespace = any;

export type ContextSpecificFactoryFunction = () => any;

export type ContextSpecificFactoryCallback = (clsNamespace: CLSNamespace) => ContextSpecificFactoryFunction;

export type Request = {
    headers: {
        host: string,
        authorization: string,
    },
    body: any,
    query: { [string]: string },
    params: { [string]: string },
    hostname: string,
    app: App,
    ioc: IoCContainer,
    emitter: any,
    auth: {
        userId: string,
    },
    ip: string,
    url: string,
    is: (string) => boolean,
    method: string,
    baseUrl: string,
    id: ?string,
    fileMetaData: ?any,
    localFilePath: ?string,
    deletedFromCloud: ?boolean,
    fileCompletelyDeleted: ?boolean,
    file: ?any
};

export type Response = {
    emitter: any,
    set: (any, any) => any,
    headersSent: boolean,
    status: (any, any) => any,
    send: (any) => any,
    write: (any) => any,
    end: () => any,
    download: () => any
}

export type ExpressNext = (any) => any;

export type Transaction = (() => Promise<any>) => Promise<any>;


export type AppServer = any;

export type Map<K, V> = { [key: K]: V };



