// @flow

import boom from '@hapi/boom';
import type { Request, Response, ExpressNext } from 'flow-typed/types';

export default (req: Request, res: Response, next: ExpressNext) => {
    const error = boom.notFound(`${req.method} ${req.baseUrl} not found on this server`);
    next(error);
};
