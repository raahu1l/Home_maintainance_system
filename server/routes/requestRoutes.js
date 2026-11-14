const express = require("express");
const router = express.Router();

const {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    getRequestStats
} = require("../controllers/requestController");

// Create a request
router.post("/", createRequest);

// Get all requests
router.get("/", getAllRequests);


router.get("/stats", getRequestStats);

// Get request by ID
router.get("/:requestId", getRequestById);

// Update request
router.patch("/:requestId", updateRequest);


// Delete request
router.delete("/:requestId", deleteRequest);


module.exports = router;