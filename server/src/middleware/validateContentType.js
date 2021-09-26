// @flow

import boom from '@hapi/boom';
import mimeTypes from 'mime-types';
import type { Request, Response, ExpressNext } from 'flow-typed/types';

export default (...contentTypes: string[]) => (req: Request, res: Response, next: ExpressNext) => {
    const isValidType = contentTypes.reduce((carry, type) => {
        const isType = req.is(type);
        // req.is returns null if the response verb doesnt support data (e.g. delete)
        return carry || !!isType || (isType === null);
    }, false);
    if (!isValidType) {
        const supportedMimeTypes = contentTypes.map(type => mimeTypes.lookup(type) || type);
        // eslint-disable-next-line max-len
        return next(boom.unsupportedMediaType(`Requests must have the Content-Type ${supportedMimeTypes.join(' or ')}`));
    }
    return next();
};
