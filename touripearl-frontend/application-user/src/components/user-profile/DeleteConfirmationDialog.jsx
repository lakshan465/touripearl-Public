import {useState, useRef, useEffect} from 'react';
import axiosFetch from "../../utils/axiosFetch.js";
import {useAuth} from "../../utils/Auth.js";

const DeleteConfirmationDialog = ({onClose}) => {
    const [confirmationCode, setConfirmationCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const {logout} = useAuth();

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    const handleInputChange = (index, value) => {
        // Allow alphanumeric characters only (letters and numbers)
        if (!/^[a-zA-Z0-9]*$/.test(value)) return;

        // Convert to uppercase for consistency
        value = value.toUpperCase();

        const newCode = [...confirmationCode];
        newCode[index] = value;
        setConfirmationCode(newCode);
        setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !confirmationCode[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        // Allow alphanumeric characters only
        if (!/^[a-zA-Z0-9]+$/.test(pastedData)) return;

        const newCode = [...confirmationCode];
        pastedData.toUpperCase().split('').forEach((char, index) => {
            if (index < 6) newCode[index] = char;
        });
        setConfirmationCode(newCode);
    };

    const handleConfirm = async () => {
        const code = confirmationCode.join('');
        if (code.length !== 6) {
            setError('Please enter all 6 characters');
            return;
        }

        try {
            await axiosFetch.delete(`api/v1/users/account-delete/${code}`).then(logout);
        } catch (e) {
            window.alert("Something went wrong..");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Delete Account</h3>
                    <p className="text-gray-600">
                        Please enter the 6-character confirmation code sent to your email to delete your account.
                        This action cannot be undone.
                    </p>
                </div>

                <div className="flex gap-2 justify-center my-6">
                    {confirmationCode.map((char, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={char}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            ref={el => inputRefs.current[index] = el}
                            className="w-12 h-12 text-center text-lg border rounded uppercase"
                        />
                    ))}
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationDialog;