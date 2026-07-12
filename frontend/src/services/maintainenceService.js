import api from "./api";

export const getMaintainenceLogs = async () => {
    return await api('/maintenance');
}

export const getMaintainenceLogById = async (id) => {
    return await api(`/maintenance/${id}`);
}

export const createMaintenance = async (data) => {
    return await api("/maintenance", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const completeMaintenance = async (id) => {
    return await api(`/maintenance/${id}/complete`, {
        method: "PATCH"
    });
};