// @flow
import { interfaces } from 'inversify';
import Mongoose from 'mongoose';

import type { Interface as ConfigService } from '../../services/config/ConfigService';

export default (context: interfaces.Context) => {
    const configService: ConfigService = context.container.getService('config');
    const {
        host,
        port,
        username,
        password,
        database,
    } = configService.getDBConnectionDetails();
    return Mongoose.createConnection(`mongodb://${username}:${password}@${host}:${port}/${database}`, { useNewUrlParser: true });
};

export type Interface = typeof Mongoose;
