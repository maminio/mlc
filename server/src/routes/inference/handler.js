// @flow

import { Router } from 'express';
import statusCodes from 'http-status-codes';
import mimeTypes from 'mime-types';
import bodyParser from 'body-parser';
import validateContentType from 'src/middleware/validateContentType';
import { jsonErrorHandler } from 'mlc-ioc/lib/middleware';

import handler from './function/handler';

const isArray = a => (!!a) && (a.constructor === Array);

const isObject = a => (!!a) && (a.constructor === Object);


const router = Router();
router.use(validateContentType('json'));
router.use(bodyParser.json());

class FunctionEvent {
    constructor(req) {
        this.body = req.body;
        this.headers = req.headers;
        this.method = req.method;
        this.query = req.query;
        this.path = req.path;
    }
}

class FunctionContext {
    constructor(cb) {
        this.value = 200;
        this.cb = cb;
        this.headerValues = {};
    }

    status(value) {
        if (!value) {
            return this.value;
        }

        this.value = value;
        return this;
    }

    headers(value) {
        if (!value) {
            return this.headerValues;
        }

        this.headerValues = value;
        return this;
    }

    succeed(value) {
        let err;
        this.cb(err, value);
    }

    fail(value) {
        let message;
        this.cb(value, message);
    }
}

const middleware = (req, res) => {
    const cb = (err, functionResult) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        if (isArray(functionResult) || isObject(functionResult)) {
            res.set(fnContext.headers())
                .status(fnContext.status())
                .send(JSON.stringify(functionResult));
        } else {
            res.set(fnContext.headers())
                .status(fnContext.status())
                .send(functionResult);
        }
    };

    const fnEvent = new FunctionEvent(req);
    let fnContext = new FunctionContext(cb);

    handler(req, fnContext, cb);
};

router.post('/*', middleware);
router.get('/*', middleware);
router.patch('/*', middleware);
router.put('/*', middleware);
router.delete('/*', middleware);

router.use(jsonErrorHandler);


export default router;
