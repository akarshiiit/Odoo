const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


const api = async (endpoint, options = {}) => {

    const response = await fetch(`${BASE_URL}${endpoint}`, {

        headers: {
            "Content-Type": "application/json",
        },

        credentials: "include",

        ...options,

    });


    const data = await response.json();


    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }


    return data;
};


export default api;