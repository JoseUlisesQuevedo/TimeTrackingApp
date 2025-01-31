import { ACCESS_TOKEN } from "./constants.js";


const api = axios.create({
    baseURL:"http://127.0.0.1:8000/api/",  // Replace with your actual API URL
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
)


export default api;

