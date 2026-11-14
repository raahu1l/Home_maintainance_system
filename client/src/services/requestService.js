const API_URL = "http://localhost:5000/api/requests";

// Create a new maintenance request
export const createRequest = async (requestData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to submit request");
    }

    return data;
};

// Get a maintenance request by Request ID
export const getRequestById = async (requestId) => {
    const response = await fetch(
        `${API_URL}/${encodeURIComponent(requestId)}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request not found");
    }

    return data;
};

export const getRequestStats = async () => {
    const response = await fetch(`${API_URL}/stats`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch statistics");
    }

    return data;
};

export const getAllRequests = async (filters = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            queryParams.append(key, value);
        }
    });

    const response = await fetch(
        `${API_URL}?${queryParams.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch requests");
    }

    return data;
};