// @flow

import { Router } from 'express';
import statusCodes from 'http-status-codes';
import mimeTypes from 'mime-types';


const router = Router();

router.get('/', async (req, res) => res.status(statusCodes.OK)
    .set('Content-Type', mimeTypes.lookup('text'))
    .send('MLC user micro-service root.'));

export default router;
