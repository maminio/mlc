// @flow
import boom from 'boom';
import { helpers as inversify } from 'inversify-vanillajs-helpers';
import 'reflect-metadata'; // must be here so we can use reflect metadata when adding new services
import { model, repository, service } from 'mlc-ioc/lib/ioc/helpers';
import type { Interface as Run } from '../../models/run';
import RunRepository from '../../repositories/run';
import type { Interface as LogService } from '../../services/logging/LogService';

class RunDomain {
    RunModel: Run;

    runRepository: RunRepository;

    logger: LogService;

    constructor(RunModel: Run, runRepository: RunRepository, logger: LogService) {
        this.RunModel = RunModel;
        this.runRepository = runRepository;
        this.logger = logger;
    }

    async getRuns(user): Promise<Run[]> {
        try {
            return await this.runRepository.getRuns(user);
        } catch (e) {
            return [];
        }
    }

    getRunById(id: string): Promise<Run> {
        return this.runRepository.getRunById(id);
    }

    createRun(run: Run): Promise<Run> {
        try {
            return this.runRepository.createRun(run);
        } catch (err) {
            this.logger.error(err);
            throw boom.badRequest('There was a problem creating the run');
        }
    }

    updateRun(run: Run): Promise<Run> {
        try {
            return this.runRepository.updateRun(run._id, run);
        } catch (err) {
            this.logger.error(err);
            throw boom.badRequest('There was a problem creating the run');
        }
    }
}

inversify.annotate(
    RunDomain,
    [
        model('run'),
        repository('run'),
        service('logging'),
    ],
);

export default RunDomain;
