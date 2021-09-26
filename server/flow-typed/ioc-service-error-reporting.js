// @flow


export interface ErrorReportingService {

    reportError(error: Error): void;

}

export type Interface = ErrorReportingService;
