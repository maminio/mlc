import { BASE_URL, axios } from './utils';

export const login = async (data) => {
    try {
        return await axios.post('/login', data);
    } catch (e) {
        console.log({ e });
    }
};
