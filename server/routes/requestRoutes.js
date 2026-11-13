const express = require("express");
const router = express.Router();

const {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest
} = require("../controllers/requestController");

// Create a request
router.post("/", createRequest);

// Get all requests
router.get("/", getAllRequests);

// Get request by ID
router.get("/:requestId", getRequestById);

// Update request
router.put("/:requestId", updateRequest);

module.exports = router;