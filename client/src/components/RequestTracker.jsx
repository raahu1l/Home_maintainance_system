
import { useState } from "react";
import { getRequestById } from "../services/requestService";

function RequestTracker() {
    const [requestId, setRequestId] = useState("");
    const [request, setRequest] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setRequest(null);

        try {
            const data = await getRequestById(requestId.trim());
            setRequest(data.data);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tracker-container">
            <h2>Track Your Request</h2>
            <p>Enter your Request ID to check its current status.</p>

            <form onSubmit={handleTrack} className="tracker-form">
                <input
                    type="text"
                    placeholder="Example: MR115"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Track Request"}
                </button>
            </form>

            {message && (
                <div className="tracker-message">{message}</div>
            )}

            {request && (
                <div className="request-result">
                    <h3>{request.requestId}</h3>

                    <p><strong>Customer:</strong> {request.customerName}</p>
                    <p><strong>Service:</strong> {request.serviceType}</p>
                    <p><strong>Description:</strong> {request.description}</p>
                    <p><strong>Request Date:</strong> {new Date(request.requestDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {request.status}</p>
                    <p><strong>Technician:</strong> {request.technician || "Not assigned yet"}</p>
                </div>
            )}
        </div>
    );
}

export default RequestTracker;
