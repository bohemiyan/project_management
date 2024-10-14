import axios from 'axios';
import { BaseAxiosConfig, BaseURL, } from './BaseConfig';



export const getUserInfo = async () => {
    try {
        const config=await BaseAxiosConfig();
        const response = await axios.get(`${BaseURL}/user`,
          config);
        return response.data;
    } catch (error) {
        return { Error: error.message };
    }
};


export const updateUserApi = async (data) => {
    try {
        const config=await BaseAxiosConfig();
        const response = await axios.put(`${BaseURL}/user`,
            data,
          config);
        return response.data;
    } catch (error) {
        return { Error: error.message };
    }
};