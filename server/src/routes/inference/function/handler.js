import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { zipDirectory } from 'src/utils/archive';
import boom from '@hapi/boom';
import type { IoCContainer } from 'flow-typed/types';
import { UpdateRunCommand } from 'src/commands/run/UpdateRun';
import { runModel } from './run';

const Minio = require('minio');
const rimraf = require('rimraf');

const downloadInput = async (url, filePath) => axios({
    url,
    responseType: 'stream',
}).then(
    response => new Promise((resolve, reject) => {
        response.data
            .pipe(fs.createWriteStream(filePath))
            .on('finish', () => resolve())
            .on('error', e => reject(e));
    }),
);


/**
 * Download location
 * RUN command
 * Result location
 * */
const BUCKET_NAME = 'results';

const dispatcher = (ioc: IoCContainer) => ioc.getFactory('dispatcher');

export const RUN_STATUS = {
    INPUT_LOADED: 'INPUT_LOADED',
    INPUT_LOAD_FAILED: 'INPUT_LOAD_FAILED',
    RUNNING: 'RUNNING',
    RUN_FAILED: 'RUN_FAILED',
    SAVING_RESULTS: 'SAVING_RESULTS',
    COMPLETED: 'COMPLETED',
};

const dispatchRunStatus = async (status, { ioc, run, data = null }) => {
    const { _id: runId } = run;
    try {
        return await dispatcher(ioc).dispatch(new UpdateRunCommand({
            action: 'update',
            payload: { status, data, runId },
        }));
    } catch (e) {
        this.logger.error('Error publish message to broker.');
        return boom.internal('Broker could not dispatch message.');
    }
};

export default async (event, context) => {
    const { body: { payload, run, deployment }, ioc } = event;
    const { model, name } = deployment;
    const {
        output: { path: results_destination },
        input: { download_destination },
        command,
    } = model;
    const MODEL_PATH = path.resolve(process.cwd(), 'src/services/builder/model');
    const DOWNLOAD_DESTINATION = download_destination && path.resolve(MODEL_PATH, download_destination);
    const RESULTS_DESTINATION = results_destination && path.resolve(MODEL_PATH, results_destination);
    const DEPLOYMENT_NAME = name;
    const COMMAND = command;

    try {
        if (deployment.model.input.type === 'download' && payload.url) {
            await downloadInput(payload.url, DOWNLOAD_DESTINATION);
        }

        /* Dispatch Message to Kafka to update a run status */
        await dispatchRunStatus(RUN_STATUS.INPUT_LOADED, { ioc, run });
    } catch (e) {
        await dispatchRunStatus(RUN_STATUS.INPUT_LOAD_FAILED, { ioc, run, stdout: JSON.stringify(e) });
        console.log({ e });
    }
    /**
     * Run model
     * Upload file to Minio
     * Dispatch to Kafka to update a RUN status
     * Update RUN results in DB
     * Delete downloaded files
     * Delete results file
    * */

    await dispatchRunStatus(RUN_STATUS.RUNNING, { ioc, run });
    let stdout = '';
    try {
        stdout = await runModel(MODEL_PATH, COMMAND, RESULTS_DESTINATION, payload.flags);
    } catch (e) {
        /* Nothing */
        await dispatchRunStatus(RUN_STATUS.RUN_FAILED, { ioc, run, stdout: JSON.stringify(e) });
    }

    const minioClient = new Minio.Client({
        endPoint: 'minio.minio.svc.cluster.local',
        port: 9000,
        useSSL: false,
        accessKey: 'kSMP5IHTKYsDY34e3m3w',
        secretKey: 'XdrzsC3EVShLEUaZUyEDAIh64fuXTsNHJzarGQGa',
    });


    await dispatchRunStatus(RUN_STATUS.SAVING_RESULTS, { ioc, run });
    const destination = `${DEPLOYMENT_NAME}/results-${new Date().getTime()}.zip`;
    /* Archive results folder */
    const out = `${__dirname}/results.zip`;
    let res = stdout;
    try {
        const isNotStdout = deployment.model?.out?.type && deployment.model?.out?.type !== 'stdout';
        if (isNotStdout) {
            await zipDirectory(RESULTS_DESTINATION, out);
            res = await minioClient.fPutObject(BUCKET_NAME, destination, out);
        }
        await dispatchRunStatus(RUN_STATUS.COMPLETED, {
            ioc,
            run,
            data: {
                result: isNotStdout ? `${BUCKET_NAME}/${destination}` : JSON.stringify(stdout),
                stdout: JSON.stringify(stdout),
            },
        });
    } catch (e) {
        console.log({ e });
    }

    try {
        rimraf.sync(out);
        rimraf.sync(RESULTS_DESTINATION);
        rimraf.sync(DOWNLOAD_DESTINATION);
    } catch (e) {
        /* DO NOTHING */
    }

    return context.status(200).succeed({ res, destination });
};
