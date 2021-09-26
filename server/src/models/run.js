// @flow
import Mongoose from 'mongoose';
import { interfaces } from 'inversify';

export default (context: interfaces.Context) => {
    const mongooseConnection: Mongoose = context.container.getConnector('mongodb');
    const RunSchema = Mongoose.Schema({
        runType: {
            type: String,
            default: 'inference',
        },
        deployment: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'DeploymentModel',
        },
        user: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['SUBMITTED', 'RUNNING', 'FAILED', 'STOPPED', 'CANCELLED', 'WORKING', 'QUEUED', 'SUCCESS', 'PENDING', 'SUCCEEDED', 'UNKNOWN', 'INPUT_LOADED',
                'INPUT_LOAD_FAILED',
                'RUN_FAILED',
                'SAVING_RESULTS',
                'COMPLETED'],
            default: 'SUBMITTED',
            required: true,
        },
        consoleOutput: {
            type: String,
        },
        output: {
            type: String,
        },
        runningTime: {
            type: Number,
        },
        creationDate: {
            type: Date,
            default: new Date(),
            required: true,
        },
        result: {
            type: String,
        },
    }, { timeStamp: true });
    return mongooseConnection.model('Run', RunSchema);
};

export type Interface = Mongoose.Model;
