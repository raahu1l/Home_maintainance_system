const express = require("express");
const router = express.Router();

const {
    createRequest,
    getAllRequests,
    getRequestById
} = require("../controllers/requestController");

// Create a request
router.post("/", createRequest);

// Get all requests
router.get("/", getAllRequests);

// Get request by ID
router.get("/:requestId", getRequestById);

module.exports = router;