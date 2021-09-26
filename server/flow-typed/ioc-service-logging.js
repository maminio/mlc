// @flow


const LogLevels = {

    error: 'error',

    warn: 'warn',

    info: 'info',

    verbose: 'verbose',

    debug: 'debug',

    silly: 'silly',

};

const LogValues = {

    error: 1,

    warn: 2,

    info: 3,

    verbose: 4,

    debug: 5,

    silly: 6,

};

export type LogLevel = $Keys<typeof LogLevels>

export interface LogService {

    setLevel(logLevel: LogLevel): void;

    getLevel(): LogLevel;

    error(message: string, ...params: any[]): void;

    warn(message: string, ...params: any[]): void;

    info(message: string, ...params: any[]): void;

    verbose(message: string, ...params: any[]): void;

    debug(message: string, ...params: any[]): void;

    silly(message: string, ...params: any[]): void;

}
