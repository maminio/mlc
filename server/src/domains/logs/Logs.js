// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';
import 'reflect-metadata'; // must be here so we can use reflect metadata when adding new services
import { repository, service } from 'mlc-ioc/lib/ioc/helpers';
import LogsRepository from '../../repositories/logs';
import type { LogEvent } from 'src/repositories/logs/Logs';
import type { LogService } from 'flow-typed/ioc-service-logging';
import boom from 'boom';

class LogsDomain {
    userRepository: LogsRepository;

    constructor(logsRepository: LogsRepository, logger: LogService,) {
        this.logsRepository = logsRepository;
        this.logger = logger;
    }

    async addLog(id: string, event: LogEvent): Promise<void> {
        await this.logsRepository.addLog(id, event);
    }


    async createLog(params): Promise<> {
        try {
            return await this.logsRepository.createLog(params);
        } catch (err) {
            this.logger.error(err);
            throw boom.badRequest('There was a problem creating new log object.');
        }
    }


}

inversify.annotate(
    LogsDomain,
    [
        repository('logs'),
        service('logging'),
    ],
);

export default LogsDomain;
