import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@components/card/card';
import { Loader2 } from 'lucide-react';
import axiosFetch from '@utils/axiosFetch';

const ApplicationStatus = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applicationData, setApplicationData] = useState(null);
    const { applicationId } = useParams();

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axiosFetch(`/api/v1/guideApplications/applicationStatus/${applicationId}`);
                console.log(response.data);
                setApplicationData(response.data.object);
            } catch (err) {
                setError('Failed to fetch application status.');
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [applicationId]);

    const centeredContent = (children) => (
        <div className="min-h-screen flex items-center justify-center p-4">
            {children}
        </div>
    );

    if (loading) {
        return centeredContent(
            <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return centeredContent(
            <Card className="max-w-md mx-auto bg-red-50">
                <CardHeader>
                    <CardTitle className="text-red-600">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-600">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (!applicationData) {
        return centeredContent(
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>No Data Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">No application data available.</p>
                </CardContent>
            </Card>
        );
    }

    const getStatusColor = (status) => {
        const statusColors = {
            pending: 'text-yellow-600 bg-yellow-50',
            approved: 'text-green-600 bg-green-50',
            rejected: 'text-red-600 bg-red-50',
            default: 'text-gray-600 bg-gray-50'
        };
        return statusColors[status?.toLowerCase()] || statusColors.default;
    };

    return centeredContent(
        <Card className="max-w-md mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Applicant Name</h3>
                    <p className="text-lg">
                        {applicationData.firstName} {applicationData.lastName}
                    </p>
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-lg">{applicationData.email}</p>
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className={`inline-block px-3 py-1 rounded-full font-medium ${getStatusColor(applicationData.status)}`}>
                        {applicationData.status}
                    </div>
                </div>

                {applicationData.status.toLowerCase() === 'pending' && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Next Steps</h3>
                        <p className="text-gray-600">
                            Your application is currently under review. Please check back later for updates.
                        </p>
                    </div>
                )}

                {applicationData.status.toLowerCase() === 'approved' && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Next Steps</h3>
                        <p className="text-gray-600">
                            Congratulations! Your application has been approved. You can login into your account with your email and phone number.
                        </p>
                    </div>
                )}

                {applicationData.status.toLowerCase() === 'rejected' && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Next Steps</h3>
                        <p className="text-gray-600">
                            We regret to inform you that your application has been rejected. Please check your email for more details.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ApplicationStatus;