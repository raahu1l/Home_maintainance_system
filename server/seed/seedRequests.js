
require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const MaintenanceRequest = require("../models/MaintenanceRequest");
const sampleRequests = require("./sampleRequests");

const seedRequests = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Insert all sample requests
        const insertedRequests = await MaintenanceRequest.insertMany(
            sampleRequests
        );

        console.log(
            `${insertedRequests.length} sample requests inserted successfully!`
        );

    } catch (error) {
        console.error("Sample Data Insertion Failed:", error.message);

    } finally {
        // Close database connection
        await mongoose.connection.close();
    }
};

seedRequests();
