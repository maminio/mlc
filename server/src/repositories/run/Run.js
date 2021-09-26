// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';
import { model } from 'mlc-ioc/lib/helpers';
import type { Interface as Run } from '../../models/run';
import $ from 'mongo-dot-notation';
import mongoose from 'mongoose'

//
export default class RunRepository {
    RunModel: Run;

    constructor(runModel: Run) {
        this.RunModel = runModel;
    }

    /**
     * Get runs
     *
     * @memberof RunRepository
     * @returns {Promise<Run>}
     */
    getRuns(user): Promise<Run[]> {
        return this.RunModel.find({ user });
    }

    /**
     * Get a run by ID
     *
     * @memberof RunRepository
     * @param {string} runId - the Id of the run
     * @returns {Promise<Run>}
     */
    getRunById(runId: string): Promise<Run> {
        return this.RunModel.findById(runId);
    }

    /**
     * Create a run
     *
     * @memberof RunRepository
     * @param {Run} run - the run to save
     * @returns {Promise<Run>}
     */
    createRun(run: Run): Promise<Run> {
        return (new this.RunModel(run)).save();
    }

    /**
     * Update a run
     *
     * @memberof RunRepository
     * @returns {Promise<Run>}
     * @param runId - the run ID to update
     * @param params - new state
     */
    updateRun(runId: string, params): Promise<Run> {
        return this.RunModel.findOneAndUpdate({ _id: runId }, $.flatten(params), {
            multi: false,
            new: true,
            useFindAndModify: false,
        });
    }
}

inversify.annotate(
    RunRepository,
    [
        model('run'),
    ],
);
