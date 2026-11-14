
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

        const requestId = await generateRequestId();

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


// Get all maintenance requests with filtering, projection and limit
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
            aboveCost,
            belowCost,
            excludeStatus,
            historyStatus,
            fields,
            limit,
            sortBy,
            order
        } = req.query;

        const conditions = [];

        // Search by Request ID or customer name ($or)
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

        // Filter by service type ($in)
        if (serviceType) {
            conditions.push({
                serviceType: {
                    $in: serviceType.split(",").map(value => value.trim())
                }
            });
        }

        // Filter by status ($in)
        if (status) {
            conditions.push({
                status: {
                    $in: status.split(",").map(value => value.trim())
                }
            });
        }

        // Exclude a particular status ($ne)
        if (excludeStatus) {
            conditions.push({
                status: {
                    $ne: excludeStatus
                }
            });
        }

        // Search inside the statusHistory array
        if (historyStatus) {
            conditions.push({
                "statusHistory.status": historyStatus
            });
        }

        // Filter by request date ($gte and $lte)
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

        // Filter by estimated cost using comparison operators
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

        if (aboveCost !== undefined) {
            const value = Number(aboveCost);

            if (!Number.isFinite(value) || value < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid above-cost value."
                });
            }

            costFilter.$gt = value;
        }

        if (belowCost !== undefined) {
            const value = Number(belowCost);

            if (!Number.isFinite(value) || value < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid below-cost value."
                });
            }

            costFilter.$lt = value;
        }

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

        if (Object.keys(costFilter).length > 0) {
            conditions.push({
                estimatedCost: costFilter
            });
        }

        // Combine all filters using $and
        const query = conditions.length > 0
            ? { $and: conditions }
            : {};

        // Allow only supported sorting fields
        const allowedSortFields = [
            "createdAt",
            "requestDate",
            "estimatedCost",
            "updateCount"
        ];

        const selectedSortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

        const sortOrder = order === "asc" ? 1 : -1;

        // Projection: allow only selected fields
        const allowedFields = [
            "requestId",
            "customerName",
            "contactNumber",
            "serviceType",
            "description",
            "requestDate",
            "preferredDate",
            "estimatedCost",
            "technician",
            "status",
            "statusHistory",
            "updateCount",
            "createdAt",
            "updatedAt"
        ];

        let selectedFields = "";

        if (fields) {
            const requestedFields = fields.split(",");

            const validFields = requestedFields.filter(field =>
                allowedFields.includes(field)
            );

            if (validFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No valid projection fields provided."
                });
            }

            selectedFields = validFields.join(" ");
        }

        // Validate result limit
        let resultLimit = 0;

        if (limit !== undefined) {
            resultLimit = Number(limit);

            if (
                !Number.isInteger(resultLimit) ||
                resultLimit < 1 ||
                resultLimit > 100
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Limit must be between 1 and 100."
                });
            }
        }

        // Build MongoDB query
        let requestQuery = MaintenanceRequest.find(query);

        if (selectedFields) {
            requestQuery = requestQuery.select(selectedFields);
        }

        if (resultLimit > 0) {
            requestQuery = requestQuery.limit(resultLimit);
        }

        const requests = await requestQuery
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
            message: "Failed to fetch maintenance requests.",
            error: error.message
        });
    }
};


// Get a single request by Request ID
const getRequestById = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await MaintenanceRequest.findOne({
            requestId
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


// Update a maintenance request using $set, $inc and $push
const updateRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const {
            technician,
            estimatedCost,
            status,
            note
        } = req.body;

        const request = await MaintenanceRequest.findOne({
            requestId
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Maintenance request not found."
            });
        }

        const updateFields = {};
        const updateOperations = {};

        // Prepare fields to update using $set
        if (technician !== undefined) {
            updateFields.technician = technician.trim() || null;
        }

        if (estimatedCost !== undefined) {
            const cost = Number(estimatedCost);

            if (!Number.isFinite(cost) || cost < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid estimated cost."
                });
            }

            updateFields.estimatedCost = cost;
        }

        // Update status if it has changed
        const statusChanged =
            status !== undefined && status !== request.status;

        if (status !== undefined) {
            const allowedStatuses = [
                "Pending",
                "Assigned",
                "In Progress",
                "Completed",
                "Cancelled"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request status."
                });
            }

            if (statusChanged) {
                updateFields.status = status;
            }
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No changes provided."
            });
        }

        // $set updates the supplied fields
        updateOperations.$set = updateFields;

        // $inc increases the update counter
        updateOperations.$inc = {
            updateCount: 1
        };

        // $push adds a new entry to statusHistory
        if (statusChanged) {
            updateOperations.$push = {
                statusHistory: {
                    status,
                    changedAt: new Date(),
                    note: note || "Status updated"
                }
            };
        }

        const updatedRequest = await MaintenanceRequest.findOneAndUpdate(
            { requestId },
            updateOperations,
            {
                new: true,
                runValidators: true
            }
        );

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


// Delete one maintenance request
const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const deletedRequest = await MaintenanceRequest.findOneAndDelete({
            requestId
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


// Delete multiple requests using deleteMany
const deleteManyRequests = async (req, res) => {
    try {
        const { requestIds } = req.body;

        if (
            !Array.isArray(requestIds) ||
            requestIds.length === 0 ||
            !requestIds.every(id => typeof id === "string" && id.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid Request IDs."
            });
        }

        const result = await MaintenanceRequest.deleteMany({
            requestId: {
                $in: requestIds.map(id => id.trim())
            }
        });

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} request(s) deleted successfully.`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error("Delete Multiple Requests Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete multiple requests.",
            error: error.message
        });
    }
};


// Get dashboard statistics using aggregation
const getRequestStats = async (req, res) => {
    try {
        const totalRequests = await MaintenanceRequest.countDocuments();

        const statusStats = await MaintenanceRequest.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const serviceStats = await MaintenanceRequest.aggregate([
            {
                $group: {
                    _id: "$serviceType",
                    count: { $sum: 1 }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            totalRequests,
            statusStats,
            serviceStats
        });

    } catch (error) {
        console.error("Get Request Stats Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics.",
            error: error.message
        });
    }
};


// Export all controller functions
module.exports = {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    deleteManyRequests,
    getRequestStats
};
