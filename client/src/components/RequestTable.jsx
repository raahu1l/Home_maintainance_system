
import { useEffect, useState } from "react";
import { getAllRequests } from "../services/requestService";

function RequestTable() {
    const [requests, setRequests] = useState([]);
    const [search, setSearch] = useState("");
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

    const fetchRequests = async (searchValue = "", filterValues = filters) => {
    try {
        setLoading(true);
        setError("");

        const data = await getAllRequests({
            search: searchValue,
            ...filterValues
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
    }, []);

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

    return (
        <div className="requests-section">
            <h2>All Maintenance Requests</h2>

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

           

            {loading ? (
                <p>Loading requests...</p>
            ) : error ? (
                <p>{error}</p>
            ) : requests.length === 0 ? (
                <p>No matching maintenance requests found.</p>
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
                            </tr>
                        </thead>

                        <tbody>
                            {requests.map((request) => (
                                <tr key={request._id}>
                                    <td>{request.requestId}</td>
                                    <td>{request.customerName}</td>
                                    <td>{request.serviceType}</td>
                                    <td>
                                        {new Date(
                                            request.requestDate
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {request.technician || "Not assigned"}
                                    </td>
                                    <td>
                                        {request.estimatedCost ?? "Not set"}
                                    </td>
                                    <td>{request.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default RequestTable;
