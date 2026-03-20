import axios from "axios";

export const refreshAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: false,
})