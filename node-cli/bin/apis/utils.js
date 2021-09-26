import axiosClient from 'axios';
import { get } from 'lodash';
import * as store from '../utils';

export const BASE_URL = ''; //  <ADD DEPLOYMENT URL
export const CONFIG_FILE = 'mlc-config.yaml';

const axios = axiosClient.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.getKey('token')}`,
    },
});


axios.interceptors.response.use(response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401) {
            originalRequest._retry = true;
            try {
                const results = await axios.post(`${BASE_URL}/refresh-token`,
                    {
                        'refresh-token': store.getKey('refreshToken'),
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${store.getKey('token')}`,
                        },
                    });
                const token = get(results, 'data.token', '');
                const refreshToken = get(results, 'data.refreshToken', '');

                store.save('token', token);
                store.save('refreshToken', refreshToken);
            } catch (e) {
                console.log('Problem using your refresh token. Please login again.🛑');
            }
        }
        return error;
    });


/**
 * @param { Promise } promise
 * @param { Object } improved - If you need to enhance the error.
 * @return { Promise }
 */
export function to(promise, improved) {
    return promise
        .then(data => [null, data])
        .catch((err) => {
            if (improved) {
                Object.assign(err, improved);
            }

            return [err]; // which is same as [err, undefined];
        });
}


export { axios };
