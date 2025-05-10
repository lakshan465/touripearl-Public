import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Loader2, CheckCircle, XCircle, AlertTriangle, ArrowLeft} from 'lucide-react';
import Dashboard from "../../dashboard/Dashboard.jsx";
import axiosFetch from "../../../../utils/axiosFetch.js";

const DisputeResolution = () => {
    const {disputeId} = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [resolving, setResolving] = useState(false);
    const [marking, setMarking] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [dispute, setDispute] = useState(null);
    const [decisionText, setDecisionText] = useState('');
    const [resolutionStatus, setResolutionStatus] = useState('');

    // Fetch dispute details
    useEffect(() => {
        const fetchDispute = async () => {
            if (!disputeId) return;

            try {
                setLoading(true);
                const response = await axiosFetch.get(`/api/v1/disputes/${disputeId}`);
                setDispute(response.data.object);
                if (response.data.object && (response.data.object.status === "RESOLVED" || response.data.object.status === "REJECTED")) {
                    setSuccess(true);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load dispute details');
                setLoading(false);
                console.error('Error fetching dispute:', err);
            }
        };

        fetchDispute();
    }, [disputeId]);

    // Handle form submission
    const handleResolveDispute = async (e) => {
        e.preventDefault();

        if (!resolutionStatus) {
            setError('Please select a resolution status');
            return;
        }

        if (!decisionText.trim()) {
            setError('Please provide decision reasoning');
            return;
        }

        try {
            setResolving(true);
            setError(null);

            // Create UpdateDisputeDto object
            const updateDisputeDto = {
                status: resolutionStatus,
                decision: decisionText.trim()
            };

            await axiosFetch.patch(`/api/v1/disputes/${disputeId}/resolve`, updateDisputeDto, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setSuccess(true);
            setResolving(false);

        } catch (err) {
            setError('Failed to resolve dispute. Please try again.');
            setResolving(false);
            console.error('Error resolving dispute:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500"/>
                <p className="mt-2 text-gray-600">Loading dispute details...</p>
            </div>
        );
    }

    const handleInProgressDispute = async () => {
        try {
            setMarking(true);
            setError(null);

            const updateStatusDto = {
                status: "IN_PROGRESS",
                decision: null
            };

            const response = await axiosFetch.patch(`/api/v1/disputes/${disputeId}/inProgress`, updateStatusDto, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setMarking(false);
            // Update the local dispute object to reflect the new status
            setDispute({...dispute, status: "IN_PROGRESS"});

        } catch (err) {
            setError('Failed to mark dispute as in progress. Please try again.');
            setMarking(false);
            console.error('Error marking dispute:', err);
        }
    }

    return (
        <Dashboard>
            <div className="max-w-2xl mx-auto p-4">
                <button
                    onClick={() => navigate('/admin/dispute-management')}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-1"/>
                    Back to Disputes
                </button>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Resolve Dispute</h1>
                    <p className="text-gray-600 mb-6">Dispute ID: {disputeId}</p>

                    {dispute && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h2 className="font-medium text-gray-700 mb-2">Dispute Details</h2>
                            <p className="text-gray-600">
                                <span className="font-medium">Booking ID:</span> {dispute.booking.propertyId || 'N/A'}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Raised By:</span> {dispute.raisedBy.email || 'N/A'}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Reason:</span> {dispute.reason || 'N/A'}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Status:</span> {dispute.status || 'N/A'}
                            </p>
                            {dispute.createdAt && (
                                <p className="text-gray-600">
                                    <span
                                        className="font-medium">Filed on:</span> {new Date(dispute.createdAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}

                    {success ? (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center">
                            <CheckCircle className="h-6 w-6 text-green-500 mr-2"/>
                            <p className="text-green-700">Dispute has been successfully resolved!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleResolveDispute}>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Resolution Status
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="resolved"
                                            name="status"
                                            value="RESOLVED"
                                            onChange={() => setResolutionStatus('RESOLVED')}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="resolved" className="ml-2 text-gray-700">
                                            Resolved (in favor of dispute raiser)
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="rejected"
                                            name="status"
                                            value="REJECTED"
                                            onChange={() => setResolutionStatus('REJECTED')}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="rejected" className="ml-2 text-gray-700">
                                            Rejected (in favor of other party)
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Decision Reasoning
                                </label>
                                <textarea
                                    value={decisionText}
                                    onChange={(e) => setDecisionText(e.target.value)}
                                    placeholder="Provide detailed reasoning for your decision..."
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                ></textarea>
                            </div>

                            {error && (
                                <div className="bg-red-50 p-3 rounded-md border border-red-200 flex items-center mb-4">
                                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2"/>
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/dispute-management')}
                                    className="px-4 py-2 text-gray-700 bg-red-400 rounded-md mr-2 hover:bg-red-500"
                                >
                                    Cancel
                                </button>
                                {dispute && dispute.status === "PENDING" && (
                                    <button
                                        type="button"
                                        onClick={handleInProgressDispute}
                                        className="px-4 py-2 text-gray-700 bg-green-300 rounded-md mr-2 hover:bg-green-400"
                                        disabled={marking}
                                    >
                                        {marking ? (
                                            <span className="flex items-center">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                            Marking...
                                        </span>
                                        ) : (
                                            "Mark as in progress"
                                        )}
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={resolving}
                                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                                >
                                    {resolving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                            Processing...
                                        </>
                                    ) : (
                                        'Resolve Dispute'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Dashboard>
    );
};

export default DisputeResolution;