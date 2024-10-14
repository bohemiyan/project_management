import axios from 'axios';
import { BaseAxiosConfig, BaseURL, ResumeAxiosConfig } from "./BaseConfig"

//=====================get dashboard====================
export const getDashboardApi = async () => {
    try {
        const config = await BaseAxiosConfig()
        const response = await axios.get(`${BaseURL}/dashboard`, config);
        return response.data;
    } catch (error) {
        console.log(error);
        return { status: 'error', message: 'Failed to fetch resume' };
    }
}



//=====================Get Company====================
export const getComanyApi = async (filter) => {
    try {
        const config = await BaseAxiosConfig()
        const response = await axios.post(`${BaseURL}/get_company`,
            filter,
            config);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error)
        return { status: 'error', message: 'Failed to fetch resume' };
    }
}


//=====================delete Company====================
export const deleteComanyApi = async (id) => {
    try {
        const config = await BaseAxiosConfig()
        const response = await axios.delete(`${BaseURL}/company/${id}`,
            config);
        return response.data;
    } catch (error) {
        console.log(error);
        return { status: 'error', message: 'Failed to fetch resume' };
    }


}



//=====================get Job====================
export const getJobApi = async (filter) => {
    try {
        const config = await BaseAxiosConfig()
        const response = await axios.post(`${BaseURL}/get_job`,
            filter,
            config);
        return response.data;
    } catch (error) {
        console.log(error)
        return { status: 'error', message: 'Failed to fetch resume' };
    }
}

//=====================Add Job====================
export const addJobApi = async (data) => {
    try {
        const config = await BaseAxiosConfig()
        const response = await axios.post(`${BaseURL}/job`,
            data,
            config);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error)
        return { status: 'error', message: 'Failed to fetch resume' };
    }
}

//=====================update Job====================
export const updateJobApi = async (id, data) => {
    try {
        const config = await BaseAxiosConfig()
        const response = await axios.put(`${BaseURL}/job/${id}`,
            data,
            config);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error)
        return { status: 'error', message: 'Failed to fetch resume' };
    }
}

//=====================delete Job====================
export const deleteJobApi = async (id) => {
    try {
        const config = await BaseAxiosConfig()
        const response = await axios.delete(`${BaseURL}/job/${id}`,
            config);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error)
        return { status: 'error', message: 'Failed to fetch resume' };
    }
}


