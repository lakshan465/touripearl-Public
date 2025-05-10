import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosFetch from "../../../../utils/axiosFetch.js";
import Dashboard from "../../dashboard/Dashboard.jsx";

const RefundDetails = () => {
    const { refundId } = useParams();
    const [refund, setRefund] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        const fetchRefundDetails = async () => {
            try {
                const response = await axiosFetch.get(`/api/v1/booking/refundRequest/${refundId}`);
                console.log(response.data.object)
                setRefund(response.data.object);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRefundDetails();
    }, [refundId]);

    const handleStatusUpdate = async (status) => {
        setUpdating(true);
        setUpdateSuccess(false);
        try {
            const response = await axiosFetch.patch(`/api/v1/booking/refundRequest/${refundId}/response`,status,{
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Update the local refund state with the new status
            setRefund({ ...refund, status });
            setUpdateSuccess(true);
            setUpdating(false);
        } catch (err) {
            setError(err.message);
            setUpdating(false);
        }
    };

    if (loading) {
        return <Dashboard><div className="p-4">Loading refund details...</div></Dashboard>;
    }

    if (error) {
        return <Dashboard><div className="p-4 text-red-600">Error: {error}</div></Dashboard>;
    }

    return (
        <Dashboard>
        <div className="p-4 bg-gray-600">
            <h1 className="text-2xl font-bold mb-4">Refund Request Details</h1>

            {refund && (
                <div className="bg-gray-700 shadow rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400">Refund ID:</p>
                            <p className="font-medium">{refund.id || refundId}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Status:</p>
                            <p className={`font-medium ${refund.status === 'APPROVED' ? 'text-green-600' : refund.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'}`}>
                                {refund.status || "PENDING"}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-400">Booking ID:</p>
                            <p className="font-medium">{refund.bookingId || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Request Date:</p>
                            <p className="font-medium">{refund.createdAt ? new Date(refund.createdAt).toLocaleDateString() : "N/A"}</p>
                        </div>

                        <div className="col-span-2">
                            <p className="text-gray-400">Reason:</p>
                            <p className="font-medium">{refund.reason || "No reason provided"}</p>
                        </div>
                    </div>

                    {!refund.status || refund.status === "PENDING" ? (
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => handleStatusUpdate("APPROVED")}
                                disabled={updating}
                                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:bg-gray-400"
                            >
                                {updating ? "Processing..." : "Approve Refund"}
                            </button>
                            <button
                                onClick={() => handleStatusUpdate("REJECTED")}
                                disabled={updating}
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded disabled:bg-gray-400"
                            >
                                {updating ? "Processing..." : "Reject Refund"}
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6 p-4 bg-gray-100 rounded">
                            <p className="text-gray-700">
                                This refund request has been {refund.status.toLowerCase()}. No further action is required.
                            </p>
                        </div>
                    )}

                    {updateSuccess && (
                        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
                            Refund status updated successfully!
                        </div>
                    )}
                </div>
            )}
        </div>
        </Dashboard>
    );
};

export default RefundDetails;