import {useState} from "react";

const FileUploadModal = ({onClose, onFileUpload, hasImg, onDelete}) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = () => {
        if (selectedFile) {
            onFileUpload(selectedFile);
            setSelectedFile(null);
            onClose();
        } else {
            alert("Please select a file to upload.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Profile Picture</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg
                    file:border-0 file:text-sm file:bg-light file:text-primary hover:file:bg-accent"
                />
                {selectedFile && (
                    <p className="text-gray-600 mt-2 text-sm">Selected File: {selectedFile.name}</p>
                )}
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90 mr-2"
                    >
                        Cancel
                    </button>
                    {hasImg && !selectedFile && <button
                        type="button"
                        onClick={onDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 mr-2"
                    >
                        Delete
                    </button>}
                    <button
                        type="button"
                        onClick={handleUpload}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                    >
                        {hasImg ? "Update" : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;
