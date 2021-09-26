

// @flow

import type { App } from 'flow-typed/ioc-types';
import handler from './handler';

export default (app: App) => {
    app.use('/', handler);
};
