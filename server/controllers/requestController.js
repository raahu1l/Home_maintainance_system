
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


const updateRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const {
            technician,
            estimatedCost,
            status,
            note
        } = req.body;

        // Find existing request
        const request = await MaintenanceRequest.findOne({
            requestId: requestId
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Maintenance request not found."
            });
        }

        // Update technician if provided
        if (technician !== undefined) {
            request.technician = technician || null;
        }

        // Update estimated cost if provided
        if (estimatedCost !== undefined) {
            request.estimatedCost = estimatedCost;
        }

        // Update status if provided
        if (status !== undefined && status !== request.status) {
            request.status = status;

            // Add status change to history
            request.statusHistory.push({
                status: status,
                note: note || "Status updated"
            });
        }

        // Save changes to MongoDB
        const updatedRequest = await request.save();

        return res.status(200).json({
            success: true,
            message: "Maintenance request updated successfully.",
            data: updatedRequest
        });

    } catch (error) {
        console.error("Update Request Error:", error);

        return res.status(400).json({
            success: false,
            message: "Failed to update maintenance request.",
            error: error.message
        });
    }
};


const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        // Find and delete the request
        const deletedRequest = await MaintenanceRequest.findOneAndDelete({
            requestId: requestId
        });

        if (!deletedRequest) {
            return res.status(404).json({
                success: false,
                message: "Maintenance request not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Maintenance request deleted successfully.",
            data: deletedRequest
        });

    } catch (error) {
        console.error("Delete Request Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete maintenance request."
        });
    }
};

module.exports = {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
     deleteRequest
};
