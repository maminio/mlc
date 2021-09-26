// @flow

export interface EventProcessor {
    process(message: any, iocContainer: any): Promise<any>;
}
