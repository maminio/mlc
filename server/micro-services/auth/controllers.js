// @flow
import type { App } from 'flow-typed/types';
import { RefreshToken, validate, auth } from 'src/routes/auth';

export default (app: App) => {
    app.use('/', validate);
    app.use('/auth', auth);
    app.use('/refresh-token', RefreshToken);
};
