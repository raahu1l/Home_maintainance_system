
import { useState } from "react";
import { createRequest } from "../services/requestService";

function RequestForm() {
    const [formData, setFormData] = useState({
        customerName: "",
        contactNumber: "",
        serviceType: "",
        preferredDate: "",
        description: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [requestId, setRequestId] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setRequestId("");

        try {
            const data = await createRequest(formData);

            setMessage("Your maintenance request was submitted successfully!");
            setRequestId(data.data.requestId);

            setFormData({
                customerName: "",
                contactNumber: "",
                serviceType: "",
                preferredDate: "",
                description: ""
            });

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-heading">
                <h2>Submit a Maintenance Request</h2>
                <p>Tell us what needs to be fixed at your home.</p>
            </div>

            {message && (
                <div className="form-message">
                    {message}
                    {requestId && (
                        <p>Your Request ID: <strong>{requestId}</strong></p>
                    )}
                </div>
            )}

            <form className="request-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Customer Name</label>
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contact Number</label>
                    <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="Enter your contact number"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Service Type</label>
                    <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a service</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Painting">Painting</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group full-width">
                    <label>Problem Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the maintenance issue..."
                        rows="4"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Request"}
                </button>
            </form>
        </div>
    );
}

export default RequestForm;
