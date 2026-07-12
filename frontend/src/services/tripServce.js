import api from "../api/api";

// Get all trips

export const getTrips = async()=>{

    return await api("/trips");

};

// Create trip

export const createTrip = async(data)=>{

    return await api("/trips",{

        method:"POST",

        body:JSON.stringify(data)

    });

};

// Complete trip

export const completeTrip = async(id,data)=>{


    return await api(`/trips/${id}/complete`,{

        method:"PUT",

        body:JSON.stringify(data)

    });


};

// Cancel trip

export const cancelTrip = async(id)=>{


    return await api(`/trips/${id}/cancel`,{

        method:"PUT"

    });


};