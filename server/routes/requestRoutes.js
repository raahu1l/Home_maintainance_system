const express = require("express");
const router = express.Router();

const {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest
} = require("../controllers/requestController");

// Create a request
router.post("/", createRequest);

// Get all requests
router.get("/", getAllRequests);

// Get request by ID
router.get("/:requestId", getRequestById);

// Update request
router.put("/:requestId", updateRequest);


// Delete request
router.delete("/:requestId", deleteRequest);

module.exports = router;