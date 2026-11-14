
const express = require("express");
const router = express.Router();

const {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    deleteManyRequests,
    getRequestStats
} = require("../controllers/requestController");


// Create a new request
router.post("/", createRequest);

// Get all requests with search, filters, projection and limit
router.get("/", getAllRequests);

// Get dashboard statistics
router.get("/stats", getRequestStats);

// Delete multiple requests
router.delete("/bulk", deleteManyRequests);

// Get one request by Request ID
router.get("/:requestId", getRequestById);

// Update one request
router.patch("/:requestId", updateRequest);

// Delete one request
router.delete("/:requestId", deleteRequest);

module.exports = router;
