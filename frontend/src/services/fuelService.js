import api from "./api";


// Get all fuel logs

export const getFuelLogs = async () => {

    return await api("/fuel");

};


// Get fuel logs of a specific vehicle

export const getFuelByVehicle = async (vehicleId) => {

    return await api(`/fuel/vehicle/${vehicleId}`);

};


// Create fuel log

export const createFuelLog = async (data) => {

    return await api("/fuel", {

        method: "POST",

        body: JSON.stringify(data)

    });

};