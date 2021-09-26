// @flow
import type { App } from 'flow-typed/types';
import inference from 'src/routes/inference';
import handle404 from 'src/routes/handle404';

export default (app: App) => {
    inference(app);
    app.use(handle404);
};
