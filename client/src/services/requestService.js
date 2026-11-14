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