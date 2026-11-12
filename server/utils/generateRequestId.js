
const MaintenanceRequest = require("../models/MaintenanceRequest");

const generateRequestId = async () => {
    const lastRequest = await MaintenanceRequest.findOne()
        .sort({ createdAt: -1 })
        .select("requestId");

    if (!lastRequest) {
        return "MR001";
    }

    const lastNumber = parseInt(
        lastRequest.requestId.replace("MR", ""),
        10
    );

    const nextNumber = lastNumber + 1;

    return `MR${String(nextNumber).padStart(3, "0")}`;
};

module.exports = generateRequestId;
