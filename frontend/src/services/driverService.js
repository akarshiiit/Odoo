import api from "./api";

export const getDrivers = async () => {

    return await api("/driver");

};

export const getDriver = async (id) => {

    return await api(`/driver/${id}`);
};


export const createDriver = async (driverData) => {

    return await api("/driver", {

        method: "POST",

        body: JSON.stringify(driverData),

    });

};

export const updateDriver = async (id, driverData) => {

    return await api(`/driver/${id}`, {

        method: "PUT",

        body: JSON.stringify(driverData),

    });

};

export const deleteDriver = async(id)=>{

    return await api(`/driver/${id}`,{

        method:"DELETE"

    });

};