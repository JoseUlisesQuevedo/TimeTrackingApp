import { ACCESS_TOKEN } from "./constants.js";
import { CACHE_EXPIRY } from "./constants.js";


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


export async function deleteMultipleEntries(entryIDs) {
    const promises = entryIDs.map(id => api.delete(`timeEntries/delete/${id}/`));
    try {
        await Promise.all(promises);
    } catch (error) {
        console.error('Error deleting time entries:', error);
    }
}

export async function fetchUsers() {
    
    const cachedUsers = JSON.parse(localStorage.getItem("cached_users"));
    const cacheTime = localStorage.getItem("user_cache_timestamp");

    if (cachedUsers && cacheTime && Date.now() - cacheTime < CACHE_EXPIRY) {
        return cachedUsers;
    }

    try {
        const response = await api.get('users/');
        if (response.status===200) {
            return await response.data;
        }
        throw new Error('Failed to get users');
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}


//Gets the projects from the BD and stores them / updates them in the local storage
export async function fetchProjects() {
    try {
        const response = await api.get('projects/');
        if (response.status===200) {
            return await response.data;
             
        }
        throw new Error('Failed to get projects');
    } catch (error) {
        console.error('Error getting projects:', error);
        return [];
    }
}
export async function fetchTimeEntries(start_date = null, end_date = null) {
    try {
        const params = {};
        if (start_date) params.start_date = start_date;
        if (end_date) params.end_date = end_date;

        const response = await api.get('timeEntries/', { params });
        if (response.status === 200) {
            return await response.data;
        }
        throw new Error('Failed to get time entries');
    } catch (error) {
        console.error('Error getting time entries:', error);
        return [];
    }
}
