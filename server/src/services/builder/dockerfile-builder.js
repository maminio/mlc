import shell from 'shelljs';

import fs from 'fs';
import { ProvisionStatus } from 'src/models/deployment';

const { exec } = require('child_process');

const path = require('path');


export const constructDockerfile = async ({ filePath, name, update, package: { requirements_file } }) => {
    console.log({ name, requirements_file, cwd: process.cwd()  });
    const reqFilePath = path.resolve(process.cwd(), './src/services/builder/model', requirements_file[0]);
    const image = `10.0.14.14:5000/${name}`;
    const flags = `${image} ${filePath}`;
    const Dockerfile = `
FROM eu.gcr.io/rectified-259021/inference-base:dev21

USER app

WORKDIR /home/app

RUN mkdir -p /home/app/src/services/builder/model
RUN bash /home/app/src/services/builder/download-model.sh ${flags} 
RUN unzip /home/app/src/routes/inference/function/${filePath} -d /home/app/src/services/builder/model/

WORKDIR /home/app/

RUN conda activate inference
RUN pip install -r ${reqFilePath}

ENV cgi_headers="true"
ENV fprocess="npm run inference"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"

ENV exec_timeout="10s"
ENV write_timeout="15s"
ENV read_timeout="15s"

HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]

        `;

    update({ status: { current: ProvisionStatus.CREATING_DOCKERFILE } });
    await new Promise((res, rej) => {
        fs.writeFile('temp-dockerfile', Dockerfile, (err) => {
            if (err) rej(err);
            res();
        });
    });

    update({ status: { current: ProvisionStatus.CREATING_CONTAINER } });
    shell.exec(`bash src/services/builder/build-image.sh ${flags}`);
    const kanikoScript = exec(`bash src/services/builder/build-image.sh ${flags}`);
    return new Promise((resolve, reject) => {
        kanikoScript.stdout.on('data', (data) => {
            console.log('======= KANIKO =======');
            console.log(data);
            console.log('-----------------------------------------');
        });
        kanikoScript.stderr.on('data', (data) => {
            // @TODO HANDLE ERRORS
            console.log({ data });
            // update({ status: { current: ProvisionStatus.ERROR } });
            reject();
        });

        kanikoScript.on('exit', async (data) => {
            console.log({ data });
            resolve({ image });
        });
    });
};
