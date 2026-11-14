
const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
    {
        requestId: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },

        customerName: {
            type: String,
            required: true,
            trim: true
        },

        contactNumber: {
            type: String,
            required: true,
            trim: true
        },

        serviceType: {
            type: String,
            required: true,
            enum: ["Plumbing", "Electrical", "Cleaning", "Carpentry", "Painting", "Other"]
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        requestDate: {
            type: Date,
            default: Date.now
        },

        preferredDate: {
            type: Date,
            default: null
        },

        estimatedCost: {
            type: Number,
            default: null,
            min: 0
        },

        technician: {
            type: String,
            default: null,
            trim: true
        },

        status: {
            type: String,
            enum: ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"],
            default: "Pending"
        },

        // Counts how many times a request has been updated
        updateCount: {
            type: Number,
            default: 0,
            min: 0
        },

        // Stores the history of status changes
        statusHistory: [
            {
                status: {
                    type: String,
                    required: true
                },
                changedAt: {
                    type: Date,
                    default: Date.now
                },
                note: {
                    type: String,
                    default: ""
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "MaintenanceRequest",
    maintenanceRequestSchema
);
