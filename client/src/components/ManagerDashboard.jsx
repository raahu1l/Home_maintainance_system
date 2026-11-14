
import { useEffect, useState } from "react";
import { getRequestStats } from "../services/requestService";
import RequestTable from "./RequestTable";

function ManagerDashboard() {
    const [stats, setStats] = useState({
        totalRequests: 0,
        statusStats: [],
        serviceStats: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showPendingRequests, setShowPendingRequests] = useState(false);

    // Fetch dashboard statistics
    const fetchStats = async () => {
        try {
            setError("");

            const data = await getRequestStats();

            setStats({
                totalRequests: data.totalRequests,
                statusStats: data.statusStats,
                serviceStats: data.serviceStats
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [showPendingRequests]);

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="dashboard-container">
            <h1>Manager Dashboard</h1>

            <p>
                {showPendingRequests
                    ? "Manage and assign pending maintenance requests."
                    : "Overview of all home maintenance requests."}
            </p>

            <button
                className="pending-requests-btn"
                onClick={() => setShowPendingRequests(!showPendingRequests)}
            >
                {showPendingRequests
                    ? "View All Requests"
                    : "Pending Requests"}
            </button>

            {!showPendingRequests && (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Total Requests</h3>
                            <h2>{stats.totalRequests}</h2>
                        </div>

                        {stats.statusStats.map((item) => (
                            <div className="stat-card" key={item._id}>
                                <h3>{item._id}</h3>
                                <h2>{item.count}</h2>
                            </div>
                        ))}
                    </div>

                    <div className="service-stats">
                        <h2>Requests by Service Type</h2>

                        {stats.serviceStats.map((item) => (
                            <div className="service-stat" key={item._id}>
                                <span>{item._id}</span>
                                <strong>{item.count}</strong>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <RequestTable
                pendingOnly={showPendingRequests}
                onDataChange={fetchStats}
            />
        </div>
    );
}

export default ManagerDashboard;
