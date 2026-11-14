
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


// Get dashboard statistics
export const getRequestStats = async () => {
    const response = await fetch(`${API_URL}/stats`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch statistics");
    }

    return data;
};


// Get all requests with search, filters, sorting, projection and limit
export const getAllRequests = async (filters = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            queryParams.append(key, value);
        }
    });

    const queryString = queryParams.toString();

    const response = await fetch(
        queryString ? `${API_URL}?${queryString}` : API_URL
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch requests");
    }

    return data;
};


// Delete one request
export const deleteRequest = async (requestId) => {
    const response = await fetch(
        `${API_URL}/${encodeURIComponent(requestId)}`,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete request");
    }

    return data;
};


// Delete multiple requests
export const deleteManyRequests = async (requestIds) => {
    const response = await fetch(`${API_URL}/bulk`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ requestIds })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete requests");
    }

    return data;
};


// Update a request
export const updateRequest = async (requestId, updateData) => {
    const response = await fetch(
        `${API_URL}/${encodeURIComponent(requestId)}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update request");
    }

    return data;
};
