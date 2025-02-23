import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
            return Promise.reject(error)
    }
    
)
createMyModelEntry: async (data) => {
    let form_data = new FormData();
    if (data.image_url)
        form_data.append("image_url", data.image_url, 
        data.image_url.name);
    form_data.append("title", data.title);
    form_data.append("description", data.description);
    form_data.append("category", data.category);
        }
export default api;