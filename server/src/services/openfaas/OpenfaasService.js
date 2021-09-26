// @flow

import { helpers as inversify } from 'inversify-vanillajs-helpers';
import { factory, service } from 'mlc-ioc/lib/ioc/helpers';
import axios from 'axios';
import type { Interface as ConfigService } from '../config/ConfigService';

export default class OpenfaasService {
    constructor(
        configService: ConfigService,
        pubsub,
        uuid,
    ) {
        this.configService = configService;
        this.pubsub = pubsub;
        this.uuid = uuid;
    }

    getOpenfaasUrl(): string {
        const { host, port } = this.configService.getOpenfaasDetails();
        return `http://${host}:${port}`;
    }

    async getFunctions() {
        const url = `${this.getOpenfaasUrl()}/system/functions`;
        try {
            const { data: functions } = await axios.get(url);
            return functions;
        } catch (e) {
            console.log({ e });
            return [];
        }
    }

    getFunctionEndpoint(name): string {
        return `${this.getOpenfaasUrl()}/function/${name}`;
    }

}

inversify.annotate(OpenfaasService, [service('config'), service('pubsub'), factory('uuid')]);
