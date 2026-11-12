
const MaintenanceRequest = require("../models/MaintenanceRequest");
const generateRequestId = require("../utils/generateRequestId");

// Create a new maintenance request
const createRequest = async (req, res) => {
    try {
        const {
            customerName,
            contactNumber,
            serviceType,
            description,
            preferredDate
        } = req.body;

        // Basic validation
        if (
            !customerName ||
            !contactNumber ||
            !serviceType ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields."
            });
        }

        // Generate unique request ID
        const requestId = await generateRequestId();

        // Create request document
        const newRequest = await MaintenanceRequest.create({
            requestId,
            customerName,
            contactNumber,
            serviceType,
            description,
            preferredDate: preferredDate || null,
            status: "Pending",
            statusHistory: [
                {
                    status: "Pending",
                    note: "Request created"
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: "Maintenance request created successfully.",
            data: newRequest
        });

    } catch (error) {
        console.error("Create Request Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create maintenance request.",
            error: error.message
        });
    }
};

module.exports = {
    createRequest
};
