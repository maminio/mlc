// @flow strict

// Modules
import 'reflect-metadata'; // must be here so we can use reflect metadata when adding new services
import express from 'express';
import uuid from 'uuid';
import { IocFactory } from 'mlc-ioc';
import path from 'path';

// Types
import type { App, Request } from 'flow-typed/types';
import type { Controllers } from 'micro-services/utils/BaseServer';


const DEFAULT_DOMAIN_NAME = 'local-mlc.ai';

export default ({ controllers, serviceConfigs }: { controllers: Controllers }) => {
    const app: App = express();
    app.enable('trust proxy', true);
    app.set('x-powered-by', false);
    app.uuid = uuid.v4();
    app.iocCache = {};
    const iocFactory = new IocFactory([path.resolve(__dirname, '../')], serviceConfigs);
    app._systemIoc = iocFactory.createNewIoCContainer('system', DEFAULT_DOMAIN_NAME, app);
    app.systemIoc = () => app._systemIoc;
    app.ioc = (serviceName: Request | string, domainName: ?string) => iocFactory
        .createNewIoCContainer(serviceName, domainName, app);

    app.configureRoutes = () => {
        controllers && controllers(app);
    };

    return app;
};

/*
* 1. Create a new deployment
* 2. Upload source code to deployment
* 3. Server will dispatch to worker with all required data
* 4. Worker starts building docker image with your configs
* 5. Worker updates status with publishing messages to Kafka
* 6. Worker creates a new deployment on Openfaas and dispatches a url with deployment id
* 7. Server will get the message and will update the deployment attributes in the database.
*
* */
