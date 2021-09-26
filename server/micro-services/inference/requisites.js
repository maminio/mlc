// @flow
import type { IoCContainer } from 'flow-typed/ioc-types';
import type { ConfigService } from 'src/services/config/ConfigServiceInterface';
import fs from 'fs';
import axios from 'axios';
import path from 'path';

const { exec } = require('child_process');

export default async (ioc: IoCContainer) => {
    console.log(' ============ RUNNING PRE REQ =================');
    const configService: ConfigService = ioc.getService('config');
    /* Run bash script to download model and install python packages.  */
    /**
     * 1. Download and unzip model by running the init bash script
     * 2. Install python packages by running install.sh bash
     * */
    const flags = process.env.DEPLOYMENT_MODEL_PATH + process.env.DEPLOYMENT_MODEL_FILETYPE;
    const modelName = process.env.DEPLOYMENT_MODEL_NAME;
    /* Check if file already download */
    let modelExists;
    try {
        modelExists = await new Promise((res, rej) => {
            fs.readdir(path.resolve(process.cwd(), './src/services/builder/model', modelName), (err, files) => {
                if (err) rej(err);
                if (files && files.length > 0) res(true);
                res(false);
            });
        });
    } catch (e) {
        console.log({ e });
    }
    console.log({ modelExists, modelName, flags });

    if (!modelExists) {
        const initScript = exec(`bash micro-services/inference/init.sh ${flags}`, );
        await new Promise((resolve, reject) => {
            initScript.stdout.on('data', (data) => {
                console.log('======= initScript =======');
                console.log(data);
                console.log('-----------------------------------------');
            });
            initScript.stderr.on('data', (data) => {
                console.log('======== INSTALL SCRIPT ERROR =========', { data });
                // reject();
            });
            initScript.on('exit', async (data) => {
                console.log({ data });
                resolve(data);
            });
        });
    }
    const reqFilePath = path.resolve(process.cwd(), './src/services/builder/model', process.env.DEPLOYMENT_REQUIREMENT_FILE);
    const installScript = exec(`bash micro-services/inference/install.sh ${reqFilePath}`);
    await new Promise((resolve, reject) => {
        installScript.stdout.on('data', (data) => {
            console.log('======= installScript =======');
            console.log(data);
            console.log('-----------------------------------------');
        });
        installScript.stderr.on('data', (data) => {
            // console.log({ data });
            // reject();
        });
        installScript.on('exit', async (data) => {
            console.log({ data });
            resolve(data);
        });
    });

    console.log('========= MODEL EXISTS ========= ', modelExists);

    /* Call API service to commit container */
    if (!modelExists) {
        await new Promise(res => setTimeout(() => { res(); }, 3000));
        try {
            const response = await axios.post(`http://mlc-api.default.svc.cluster.local:5000/deployment/commit/${process.env.DEPLOYMENT_ID}`, null, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log({ response });
        } catch (e) {
            console.log({ e });
        }
    }

    return Promise.resolve();
};
