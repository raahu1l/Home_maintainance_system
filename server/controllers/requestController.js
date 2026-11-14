
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
        const {
            search,
            serviceType,
            status,
            startDate,
            endDate,
            minCost,
            maxCost,
            sortBy,
            order
        } = req.query;

        // Build database query conditions
        const conditions = [];

        // Search by request ID or customer name
        if (search) {
            const escapedSearch = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            conditions.push({
                $or: [
                    {
                        requestId: {
                            $regex: escapedSearch,
                            $options: "i"
                        }
                    },
                    {
                        customerName: {
                            $regex: escapedSearch,
                            $options: "i"
                        }
                    }
                ]
            });
        }

        // Filter by one or multiple service types
        if (serviceType) {
            const services = serviceType.split(",");

            conditions.push({
                serviceType: {
                    $in: services
                }
            });
        }

        // Filter by one or multiple statuses
        if (status) {
            const statuses = status.split(",");

            conditions.push({
                status: {
                    $in: statuses
                }
            });
        }

        // Filter by request date range
        if (startDate || endDate) {
            const dateFilter = {};

            if (startDate) {
                const start = new Date(startDate);

                if (isNaN(start.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid start date."
                    });
                }

                dateFilter.$gte = start;
            }

            if (endDate) {
                const end = new Date(endDate);

                if (isNaN(end.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid end date."
                    });
                }

                end.setUTCHours(23, 59, 59, 999);
                dateFilter.$lte = end;
            }
            // Check whether start date is after end date
if (
    startDate &&
    endDate &&
    new Date(startDate) > new Date(endDate)
) {
    return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date."
    });
}

            conditions.push({
                requestDate: dateFilter
            });
        }

        // Filter by estimated cost
        if (minCost !== undefined || maxCost !== undefined) {
            const costFilter = {};

            if (minCost !== undefined) {
                const min = Number(minCost);

                if (!Number.isFinite(min) || min < 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid minimum cost."
                    });
                }

                costFilter.$gte = min;
            }

            if (maxCost !== undefined) {
                const max = Number(maxCost);

                if (!Number.isFinite(max) || max < 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid maximum cost."
                    });
                }

                costFilter.$lte = max;
            }

            // Check whether minimum cost exceeds maximum cost
if (
    minCost !== undefined &&
    maxCost !== undefined &&
    Number(minCost) > Number(maxCost)
) {
    return res.status(400).json({
        success: false,
        message: "Minimum cost cannot exceed maximum cost."
    });
}

            conditions.push({
                estimatedCost: costFilter
            });
        }

        // Combine all supplied filters
        const query = conditions.length > 0
            ? { $and: conditions }
            : {};

        // Allow only supported sorting fields
        const allowedSortFields = [
            "createdAt",
            "requestDate",
            "estimatedCost"
        ];

        const selectedSortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

        const sortOrder = order === "asc" ? 1 : -1;

        // Fetch matching requests
        const requests = await MaintenanceRequest.find(query)
            .sort({ [selectedSortField]: sortOrder });

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

const getRequestStats = async (req, res) => {
    try {
        // Total number of requests
        const totalRequests = await MaintenanceRequest.countDocuments();

        // Count requests grouped by status
        const statusStats = await MaintenanceRequest.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Count requests grouped by service type
        const serviceStats = await MaintenanceRequest.aggregate([
            {
                $group: {
                    _id: "$serviceType",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalRequests,
            statusStats,
            serviceStats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};

module.exports = {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
     deleteRequest,
     getRequestStats
};
