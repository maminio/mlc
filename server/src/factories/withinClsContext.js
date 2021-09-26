// @flow

import { interfaces } from 'inversify';
import boom from 'boom';

import type { CLSNamespace } from '../types';

export type ContextFactoryCallback = (CLSNamespace, ...any) => any;

/* BE VERY CAREFUL WHEN REFACTORING THIS CODE!
* We have a security risk around mixing IoC (which is shared across request) and request specific
* values like user IDs. If a service uses IoC to access the user ID and stores that value in the
* constructor we risk performing actions on behalf of another user instead of the one that's
* actually authenticated - this could mean allowing a disabled user to potentially
* perform actions as if they were an admin!
* Ensuring context factories return a function and by passing in the CLS namespace as late as possible
* we can help protect against described the issues above.
*/
export default (context: interfaces.Context, callback: ContextFactoryCallback) => {
    if (typeof callback !== 'function') {
        throw boom.serverUnavailable('No callback has been provided');
    }
    // $FlowIgnore
    return (...args) => {
        const clsNamespace: CLSNamespace = context.container.getConnector('cls');
        return callback(clsNamespace, ...args);
    };
};
