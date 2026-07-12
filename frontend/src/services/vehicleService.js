import api from "./api";


// Get all vehicles

export const getVehicles = async () => {

    return await api("/vehicles");

};

// Get single vehicle

export const getVehicle = async (id) => {

    return await api(`/vehicles/${id}`);

};

// Create vehicle

export const createVehicle = async (vehicleData) => {

    return await api("/vehicles", {

        method: "POST",

        body: JSON.stringify(vehicleData),

    });

};



// Update vehicle

export const updateVehicle = async (id, vehicleData) => {

    return await api(`/vehicles/${id}`, {

        method: "PUT",

        body: JSON.stringify(vehicleData),

    });

};



// Delete vehicle

export const deleteVehicle = async (id) => {

    return await api(`/vehicles/${id}`, {

        method: "DELETE",

    });

};