import axios from "axios";
import { toast } from "react-hot-toast";

const axiosFetch = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Add a response interceptor
axiosFetch.interceptors.response.use(
    (response) => {
        // Return the response if successful
        return response;
    },
    (error) => {
        // Check if it's a network error (no response object)
        if (!error.response) {
            toast.error("Network error: Server not Responding.");
        }
        // Return a rejected promise to propagate the error
        return Promise.reject(error);
    }
);

export default axiosFetch;
