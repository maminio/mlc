// @flow
import type { App } from 'flow-typed/types';


import create from './create';
import commit from './commit';
import getDeployments from './get';
import updateDeployment from './update';
import deploy from './deploy';
import run from './run';

export default (base: string, app: App) => {
    app.use(`${base}/`, create);
    app.use(`${base}/`, getDeployments);
    app.use(`${base}/commit`, commit);
    app.use(`${base}/update`, updateDeployment);
    app.use(`${base}/deploy`, deploy);
    app.use('/run', run);
};
