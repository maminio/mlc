// @flow
import type { App } from 'flow-typed/types';
import handle404 from 'src/routes/handle404';

import root from './root';
import registration from './registration';
import login from './login';
import password from './password';
import verification from './verification';
import logout from './logout';


// import validateToken from './validate-token';

export default (app: App) => {
    app.use('/', root);
    app.use('/login', login(app));
    app.use('/registration', registration);


    // app.use('/password', password);
    // app.use('/verification', verification);
    app.use('/logout', logout);
};
