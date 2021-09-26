// @flow
import type { App } from 'flow-typed/types';
import controller from 'src/routes/user';

export default (app: App) => {
    controller(app);
};
