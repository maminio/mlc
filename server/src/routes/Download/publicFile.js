// @flow

import boom from 'boom';
import { Router } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import request from 'request';
import type { Request, Response } from 'flow-typed/types';
import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';
import type { Interface as ConfigService } from '../../services/config/ConfigService';
import validateContentType from '../../middleware/validateContentType';
import handle404 from '../handle404';

const router = Router();

router.use(validateContentType('json'));

router.use(bodyParser.json());

router.get('/download/:uri', (req: Request, res: Response) => {
    const { ioc } = req;
    const configService: ConfigService = ioc.getService('config');
    if (!req.params.uri) {
        return res.json(boom.notFound());
    }
    const fileId = req.params.uri;
    return axios.get(`http://${configService.getStorageServiceURL()}:${configService.getStorageServicePort()}/files/metadata/${fileId}`)
        .then(({ data }) => {
            if (data.output && data.output.statusCode !== 200) {
                return res.json(data);
            }
            if (data.accessType === 'PUBLIC') {
                const fileUrl = `https://storage.googleapis.com/${data.bucket}/${data.path}`;
                return request(fileUrl).pipe(res);
            }
            return res.json(boom.forbidden());
        }).catch(error => res.json(error));
});

router.use(handle404);

router.use(jsonErrorHandler);

export default router;
