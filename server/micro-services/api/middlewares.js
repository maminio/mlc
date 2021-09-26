// @flow


import cors from 'cors';
import responseTime from 'response-time';
import morgan from 'morgan';
import type { App } from 'flow-typed/types';
import { ioc } from 'mlc-ioc/lib/middleware';
import {
    middleware as servertimeMiddleware,
    start as startTiming, end as endTiming } from 'mlc-ioc/lib/utils/servertime';
import { calculateToken } from 'src/middleware/express-jwt';


const middlewareTimingKey = 'middleware';

export default (app: App) => {
    const iocContainer = app.systemIoc();

    app.use(servertimeMiddleware({ devOnly: true })); // servertime middleware is first so we can time all middleware

    app.use(startTiming(middlewareTimingKey, 'Express Middleware'));

    app.use(ioc);

    app.use('/*', cors({
        methods: '*',
        allowedHeaders: '*',
    }));

    app.use(morgan('combined', {
        stream: iocContainer.getFactory('morgan-log-stream'),
    }));

    app.use(responseTime());

    app.use((req, res, next) => {
        req.token = calculateToken(req);
        next();
    });

    app.use(endTiming(middlewareTimingKey)); // MUST be last to finish timing middleware
};
