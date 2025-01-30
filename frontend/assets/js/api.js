import { accessToken } from "./constants";


const api = axios.create({
    baseURL:"http://127.0.0.1:8000/api/",  // Replace with your actual API URL
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(accessToken);
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

