import api from "./api";


// Get all vehicles

export const getVehicles = async () => {

    return await api("/vehicle");

};



// Get single vehicle

export const getVehicle = async (id) => {

    return await api(`/vehicle/${id}`);

};



// Create vehicle

export const createVehicle = async (vehicleData) => {

    return await api("/vehicle", {

        method: "POST",

        body: JSON.stringify(vehicleData),

    });

};



// Update vehicle

export const updateVehicle = async (id, vehicleData) => {

    return await api(`/vehicle/${id}`, {

        method: "PUT",

        body: JSON.stringify(vehicleData),

    });

};



// Delete vehicle

export const deleteVehicle = async (id) => {

    return await api(`/vehicle/${id}`, {

        method: "DELETE",

    });

};