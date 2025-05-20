import {AlertCircle} from "lucide-react";
import {useState} from "react";
import AxiosFetch from "../../utils/axiosFetch.js";
import {useNavigate} from "react-router-dom";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog.jsx";

const AccountDeletePopup = ({onClose, email}) => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        reason: ''
    })
    const [isSubmitClick, setIsSubmitClick] = useState(false);
    const navigate = useNavigate();

    const hasReason = () => {
        const newError = {}

        if (!formData.reason) {
            newError.reason = "please mention your reason."
        }
        setErrors(newError);

        return Object.keys(newError).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (hasReason()) {
            try {
                const response = await AxiosFetch.post(`api/v1/users/account-delete/${email}`);
                setIsSubmitClick(true)
            } catch (error) {
                alert("Something went wrong. please try again.")
            }
        }
    };


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev, [name]: value
        }))
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">Delete Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4 ">
                    <div className="flex flex-col gap-4">
                        <div className="mt-1 relative">
                            <input
                                name="reason"
                                type='text'
                                value={formData.reason}
                                onChange={handleChange}
                                className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm 
                                placeholder-gray-400 ${
                                    errors['reason'] ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-gray-500 focus:border-gray-500`}
                                placeholder="What is the reason for delete account"
                            />
                        </div>
                        {errors['reason'] && (
                            <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
                                <AlertCircle className="h-4 w-4"/>
                                <span>{errors['reason']}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-600"
                        >
                            Delete Confirm
                        </button>
                    </div>
                </form>
            </div>
            {
                isSubmitClick && <DeleteConfirmationDialog onClose={onClose}/>
            }
        </div>
    );
};

export default AccountDeletePopup;
