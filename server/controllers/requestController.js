
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

// Get all maintenance requests
const getAllRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });

    } catch (error) {
        console.error("Get All Requests Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch maintenance requests."
        });
    }
};


// Get a single request by request ID
const getRequestById = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await MaintenanceRequest.findOne({
            requestId: requestId
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Maintenance request not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: request
        });

    } catch (error) {
        console.error("Get Request By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch maintenance request."
        });
    }
};

module.exports = {
    createRequest,
    getAllRequests,
    getRequestById
};
