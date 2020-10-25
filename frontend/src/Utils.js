import axiso_root from 'axios';

const axios_config = {
    baseURL: 'https://ohan-food-backend.herokuapp.com/',
    timeout: 30000,
};

const axios = axiso_root.create(axios_config);
axios.defaults.withCredentials = true

export { axios };
