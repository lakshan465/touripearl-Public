import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../pages/admin/dashboard/Dashboard';

function ReviewApplication() {
    const { userId } = useParams();
    const url = 'http://localhost:8085/api/v1/guideApplications/' + userId;
    const [application, setApplication] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const Navi = useNavigate();
    const [confirm, setConfirm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const [guideApplicationId, setGuideApplicationId] = useState();
    const [applicationStatus, setApplicationStatus] = useState();
    // const [isModalOpen, setIsModalOpen] = useState(false);





    // Use useEffect to fetch data on component mount or after updating status
    useEffect(() => {
        const fetchData = () => {
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        throw Error('Failed to fetch application data');
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data.code === 200 && data.object) {
                        setApplication(data.object); // Set the application data
                    } else {
                        throw Error('Unexpected response format or error');
                    }
                    setIsPending(false); // Indicate that fetching is complete
                })
                .catch((error) => {
                    console.error(error.message);
                    setIsPending(false); // Ensure loading state is reset
                });
        };

        // Simulate delay for loading state
        const timeoutId = setTimeout(fetchData, 1000); // to simulate fetching from server

        // Cleanup timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [url, isPending, confirm,deleteConfirm]); // Dependency array ensures the effect runs when `url` changes


    const handleMsgOk = () => {//pop up box 


        const sendStatus = {
            guideApplicationId: guideApplicationId,
            applicationStatus: applicationStatus, // Set the status 
        };
        fetch('http://localhost:8085/api/v1/guideApplications/createGuide', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sendStatus),
        }).then(() => {
            console.log('Status updated!');
            // After updating status, re-fetch the data to re-render the component with updated status
            setIsPending(true); // Set isPending to true to show the loading spinner
            setTimeout(() => {
                // Trigger the re-fetching of data by navigating
                Navi(`/admin/guide-management/${userId}`);
            }, 1000); // simulate notification delay

        });
        setConfirm(false);

    }
    const handleMsgNo = () => {//pop up box 


        // After updating status, re-fetch the data to re-render the component with updated status
        setIsPending(true); // Set isPending to true to show the loading spinner
        setTimeout(() => {
            // Trigger the re-fetching of data by navigating
            Navi(`/admin/guide-management/${userId}`);
            setIsPending(false);
        }, 100); // simulate notification delay


        setConfirm(false);
        setDeleteConfirm(false);
    }

    const handleDeleteMsgOk = () => {//pop up box 
        Navi(`/admin/guide-management/`);
        const sendStatus = {
            guideApplicationId: guideApplicationId,
            applicationStatus: applicationStatus, // Set the status 
        };
        fetch('http://localhost:8085/api/v1/guideApplications/deleteGuideApplication', {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sendStatus),
        }).then(() => {
            console.log('Status updated!');

            setIsPending(true); // Set isPending to true to show the loading spinner
            setTimeout(() => {
                // Trigger the re-fetching of data by navigating
                Navi(`/admin/guide-management/`);
            }, 1000); // simulate notification delay

        });
        setDeleteConfirm(false);
    }


    const handleDelete = (e) => {
        e.preventDefault();
        setDeleteConfirm(true);

        setGuideApplicationId(userId);
        setApplicationStatus("non");
        //Navi(`/admin/guide-management/`);
    }

    // Handle the approval status update in form
    const handleYes = (e) => {
        e.preventDefault();
        setConfirm(true);

        setGuideApplicationId(userId);
        setApplicationStatus("APPROVED")// Set the status as APPROVED



    };
    // Handle the rejected status update in form
    const handleNo = (e) => {
        e.preventDefault();
        setConfirm(true);
        setGuideApplicationId(userId);
        setApplicationStatus("REJECTED")

        // const sendStatus = {
        //     guideApplicationId: userId,
        //     applicationStatus: "REJECTED", // Set the status as APPROVED
        // };


    };

    return (
        <Dashboard title="Guide Management">
            <div className="container mx-auto p-6">
                {isPending ? (
                    <div className="flex justify-center items-center py-10">
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            {/* Spinner */}
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : application ? (
                    <div className="bg-gray-800 shadow-md rounded-lg border border-gray-600 p-6 max-w-4xl mx-auto space-y-4">
                        <h1 className="text-3xl font-bold text-white mb-4">
                            Guide Application: <span className="text-blue-600">{application.guideApplicationId}</span>
                        </h1>
                        <p className="text-lg font-medium text-gray-300">
                            <span className="font-semibold text-gray-200">Name:</span> {application.firstname} {application.lastname}
                        </p>
                        <p className="text-lg text-gray-300">
                            <span className="font-semibold text-gray-200">Email:</span> {application.email}
                        </p>
                        <p className="text-lg text-gray-300">
                            <span className="font-semibold text-gray-200">Address:</span> {application.address}
                        </p>
                        <p className="text-lg text-gray-300">
                            <span className="font-semibold text-gray-200">Biography:</span> {application.biography}
                        </p>
                        <p className="text-lg text-gray-300">
                            <span className="font-semibold text-gray-200">Status:</span>{" "}
                            <span
                                className={`font-semibold ${application.applicationStatus === "PENDING"
                                    ? "text-yellow-500"
                                    : application.applicationStatus === "APPROVED"
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                            >
                                {application.applicationStatus}
                            </span>
                        </p>
                        {confirm && (
                            <div
                                className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
                            >
                                <div className="p-4 w-full max-w-md">
                                    <div className="p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">


                                        {/* Modal Icon */}
                                        {/* <svg
                                        className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg> */} {/* DustBin */}
                                        <svg
                                            className="text-yellow-400 dark:text-yellow-500 w-11 h-11 mb-3.5 mx-auto"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.597c.76 1.352-.193 3.044-1.742 3.044H3.48c-1.55 0-2.502-1.692-1.742-3.044L8.257 3.1zm.743 12a1 1 0 112 0 1 1 0 01-2 0zm.25-4a.75.75 0 001.5 0v-3a.75.75 0 10-1.5 0v3z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>


                                        {/* Confirmation Text */}
                                        <p className="mb-4 text-gray-500 dark:text-gray-300">
                                            Are you sure you want to update Status
                                        </p>

                                        {/* Buttons */}
                                        <div className="flex justify-center items-center space-x-4">
                                            <button
                                                onClick={handleMsgNo}
                                                type="button"
                                                className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                            >
                                                No, cancel
                                            </button>
                                            <button
                                                onClick={handleMsgOk}
                                                type="submit"
                                                className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                                            >
                                                Yes, I'm sure
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        )}

                        {application.applicationStatus === "PENDING" && (
                            <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-md flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold text-gray-200 mb-4">Change State to:</p>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={handleYes}
                                            className="px-6 py-2 bg-green-500 text-white font-medium rounded-md shadow hover:bg-green-600 transition duration-300 focus:outline-none focus:ring focus:ring-green-300"
                                        >
                                            APPROVED
                                        </button>
                                        <button
                                            onClick={handleNo}
                                            value="REJECTED"
                                            className="px-6 py-2 bg-red-500 text-white font-medium rounded-md shadow hover:bg-red-600 transition duration-300 focus:outline-none focus:ring focus:ring-red-300"
                                        >
                                            REJECTED
                                        </button>
                                    </div>
                                </div>
                                <button onClick={handleDelete} className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md shadow hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring focus:ring-gray-300">
                                    DELETE
                                </button>
                            </div>
                        )}

                         {deleteConfirm && (
                            <div
                                className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
                            >
                                <div className="p-4 w-full max-w-md">
                                    <div className="p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">


                                        
                                        <svg
                                            className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg> 

                                        
                                        <p className="mb-4 text-gray-500 dark:text-gray-300">
                                            Are you sure you want Delete
                                        </p>

                                        
                                        <div className="flex justify-center items-center space-x-4">
                                            <button
                                                onClick={handleMsgNo}
                                                type="button"
                                                className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                            >
                                                No, cancel
                                            </button>
                                            <button
                                                onClick={handleDeleteMsgOk}
                                                type="submit"
                                                className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                                            >
                                                Yes, I'm sure
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        )}

                        



                        {application.applicationStatus !== "PENDING" && (
                            <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-md flex justify-between items-center">
                                <button onClick={handleDelete} className="px-6 py-2 bg-red-500 text-white font-medium rounded-md shadow hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring focus:ring-gray-300">
                                    DELETE
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center py-10 bg-gray-800 rounded-lg shadow-md border border-gray-600">
                        <h2 className="text-2xl font-semibold text-gray-300">No data found</h2>
                        <p className="text-gray-500 mt-2">Please check the ID or try another application.</p>
                    </div>
                )}
            </div>

        </Dashboard>

    );
}

export default ReviewApplication;
