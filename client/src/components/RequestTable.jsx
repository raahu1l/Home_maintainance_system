
import { useEffect, useState } from "react";
import {
    getAllRequests,
    deleteRequest,
    updateRequest
} from "../services/requestService";

function RequestTable({ pendingOnly = false, onDataChange }) {
    const [requests, setRequests] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState("");

    const [assignments, setAssignments] = useState({});

    const [filters, setFilters] = useState({
        serviceType: "",
        status: "",
        startDate: "",
        endDate: "",
        minCost: "",
        maxCost: "",
        sortBy: "createdAt",
        order: "desc"
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch requests with search and filters
    const fetchRequests = async (searchValue = "", filterValues = filters) => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllRequests({
                search: searchValue,
                ...filterValues,
                ...(pendingOnly && { status: "Pending" })
            });

            setRequests(data.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [pendingOnly]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRequests(search.trim(), filters);
    };

    const handleClear = () => {
        setSearch("");
        fetchRequests();
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleApplyFilters = () => {
        fetchRequests(search.trim(), filters);
    };

    const handleResetFilters = () => {
        const defaultFilters = {
            serviceType: "",
            status: "",
            startDate: "",
            endDate: "",
            minCost: "",
            maxCost: "",
            sortBy: "createdAt",
            order: "desc"
        };

        setFilters(defaultFilters);
        setSearch("");
        fetchRequests("", defaultFilters);
    };

    // Delete request functionality
    const handleDeleteClick = (requestId) => {
        setSelectedRequestId(requestId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteRequest(selectedRequestId);

            setShowDeleteModal(false);
            setSelectedRequestId("");

            await fetchRequests(search.trim(), filters);
            await onDataChange?.();
        } catch (error) {
            alert(error.message);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedRequestId("");
    };

    // Handle assignment input changes
    const handleAssignmentChange = (requestId, field, value) => {
        setAssignments((previous) => ({
            ...previous,
            [requestId]: {
                ...previous[requestId],
                [field]: value
            }
        }));
    };

    // Assign technician and estimated cost
    const handleAssign = async (requestId) => {
        const assignment = assignments[requestId] || {};

        const technician = assignment.technician?.trim();
        const estimatedCost = assignment.estimatedCost;

        if (!technician || estimatedCost === undefined || estimatedCost === "") {
            alert("Please enter technician name and estimated cost.");
            return;
        }

        const cost = Number(estimatedCost);

        if (!Number.isFinite(cost) || cost < 0) {
            alert("Please enter a valid estimated cost.");
            return;
        }

        try {
            await updateRequest(requestId, {
                technician,
                estimatedCost: cost,
                status: "Assigned"
            });

            setAssignments((previous) => {
                const updated = { ...previous };
                delete updated[requestId];
                return updated;
            });

            await fetchRequests(search.trim(), filters);
            await onDataChange?.();

        } catch (error) {
            alert(error.message);
        }
    };

    // Update request status
    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            await updateRequest(requestId, {
                status: newStatus
            });

            await fetchRequests(search.trim(), filters);
            await onDataChange?.();

        } catch (error) {
            alert(error.message);
        }
    };

    // View request details
    const handleViewDetails = (request) => {
        setSelectedRequest(request);
    };

    return (
        <div className="requests-section">
            <h2>
                {pendingOnly
                    ? "Pending Maintenance Requests"
                    : "All Maintenance Requests"}
            </h2>

            {!pendingOnly && (
                <>
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search Request ID or Customer Name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button type="submit">Search</button>

                        <button type="button" onClick={handleClear}>
                            Clear
                        </button>
                    </form>

                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Service Type</label>
                            <select
                                name="serviceType"
                                value={filters.serviceType}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Services</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Carpentry">Carpentry</option>
                                <option value="Painting">Painting</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Assigned">Assigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div className="filter-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div className="filter-group">
                            <label>Minimum Cost</label>
                            <input
                                type="number"
                                name="minCost"
                                placeholder="Min cost"
                                min="0"
                                value={filters.minCost}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div className="filter-group">
                            <label>Maximum Cost</label>
                            <input
                                type="number"
                                name="maxCost"
                                placeholder="Max cost"
                                min="0"
                                value={filters.maxCost}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div className="filter-group">
                            <label>Sort By</label>
                            <select
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                            >
                                <option value="createdAt">Request Date</option>
                                <option value="estimatedCost">Estimated Cost</option>
                                <option value="requestDate">Date Requested</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Order</label>
                            <select
                                name="order"
                                value={filters.order}
                                onChange={handleFilterChange}
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button type="button" onClick={handleApplyFilters}>
                            Apply Filters
                        </button>

                        <button type="button" onClick={handleResetFilters}>
                            Reset Filters
                        </button>
                    </div>
                </>
            )}

            {loading ? (
                <p>Loading requests...</p>
            ) : error ? (
                <p>{error}</p>
            ) : requests.length === 0 ? (
                <p>
                    {pendingOnly
                        ? "No pending maintenance requests."
                        : "No matching maintenance requests found."}
                </p>
            ) : (
                <div className="table-wrapper">
                    <table className="requests-table">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Request Date</th>
                                <th>Technician</th>
                                <th>Estimated Cost</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {requests.map((request) => (
                                <tr key={request._id}>
                                    <td>
                                        <button
                                            className="request-id-btn"
                                            onClick={() => handleViewDetails(request)}
                                        >
                                            {request.requestId}
                                        </button>
                                    </td>

                                    <td>{request.customerName}</td>
                                    <td>{request.serviceType}</td>

                                    <td>
                                        {new Date(
                                            request.requestDate
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>
                                        {pendingOnly ? (
                                            <input
                                                type="text"
                                                placeholder="Technician name"
                                                value={
                                                    assignments[request.requestId]?.technician || ""
                                                }
                                                onChange={(e) =>
                                                    handleAssignmentChange(
                                                        request.requestId,
                                                        "technician",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            request.technician || "Not assigned"
                                        )}
                                    </td>

                                    <td>
                                        {pendingOnly ? (
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="Estimated cost"
                                                value={
                                                    assignments[request.requestId]?.estimatedCost ?? ""
                                                }
                                                onChange={(e) =>
                                                    handleAssignmentChange(
                                                        request.requestId,
                                                        "estimatedCost",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            request.estimatedCost ?? "Not set"
                                        )}
                                    </td>

                                    <td>
                                        {request.status === "Pending" ? (
                                            <span>Pending</span>
                                        ) : (
                                            <select
                                                value={request.status}
                                                onChange={(e) =>
                                                    handleStatusUpdate(
                                                        request.requestId,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="Assigned">Assigned</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        )}
                                    </td>

                                    <td>
                                        {pendingOnly && (
                                            <button
                                                className="pending-assign-btn"
                                                onClick={() =>
                                                    handleAssign(request.requestId)
                                                }
                                            >
                                                Assign
                                            </button>
                                        )}

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDeleteClick(request.requestId)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="delete-modal">
                        <div className="modal-icon">!</div>

                        <h2>Delete Request?</h2>

                        <p>
                            Are you sure you want to delete request
                            <strong> {selectedRequestId}</strong>?
                            This action cannot be undone.
                        </p>

                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-delete-btn"
                                onClick={confirmDelete}
                            >
                                Delete Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Details Modal */}
            {selectedRequest && (
                <div className="modal-overlay">
                    <div className="details-modal">
                        <div className="details-header">
                            <h2>Request Details</h2>

                            <button
                                className="details-close-btn"
                                onClick={() => setSelectedRequest(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="details-content">
                            <p>
                                <strong>Request ID:</strong>{" "}
                                {selectedRequest.requestId}
                            </p>

                            <p>
                                <strong>Customer:</strong>{" "}
                                {selectedRequest.customerName}
                            </p>

                            <p>
                                <strong>Contact:</strong>{" "}
                                {selectedRequest.contactNumber}
                            </p>

                            <p>
                                <strong>Service:</strong>{" "}
                                {selectedRequest.serviceType}
                            </p>

                            <div className="description-box">
                                <strong>Problem Description</strong>
                                <p>
                                    {selectedRequest.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            <p>
                                <strong>Request Date:</strong>{" "}
                                {new Date(
                                    selectedRequest.requestDate
                                ).toLocaleDateString()}
                            </p>

                            <p>
                                <strong>Preferred Date:</strong>{" "}
                                {selectedRequest.preferredDate
                                    ? new Date(
                                        selectedRequest.preferredDate
                                    ).toLocaleDateString()
                                    : "Not specified"}
                            </p>

                            <p>
                                <strong>Technician:</strong>{" "}
                                {selectedRequest.technician || "Not assigned"}
                            </p>

                            <p>
                                <strong>Estimated Cost:</strong>{" "}
                                {selectedRequest.estimatedCost ?? "Not set"}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedRequest.status}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RequestTable;
