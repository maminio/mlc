
const shell = require('shelljs');

export const runModel = (modelLocation, command, resultDestinationFolder, flags = '') => (new Promise((res, rej) => {
    const makeResults = (resultDestinationFolder && `mkdir -p ${resultDestinationFolder} ;`) || '';
    const shCommand = `${makeResults} cd ${modelLocation} && conda run -n inference /bin/bash -c "  ${command} ${flags}"`;

    shell.exec(
        shCommand,
        (code, stdout, stderr) => {
            if (code !== 0) return rej({ code, stdout, stderr });
            return res({ code, stdout, stderr });
        },
    );
}));
