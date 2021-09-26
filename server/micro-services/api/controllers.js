// @flow
import type { App } from 'flow-typed/types';
import { RefreshToken, validate, auth } from 'src/routes/auth';
import UserController from 'src/routes/user';
import DeploymentController from 'src/routes/deployment';
import handle404 from 'src/routes/handle404';

export default (app: App) => {
    DeploymentController('/deployment', app);
    app.use('/', validate);
    app.use('/auth', auth);
    app.use('/refresh-token', RefreshToken);
    UserController(app);

    app.use(handle404);
};
