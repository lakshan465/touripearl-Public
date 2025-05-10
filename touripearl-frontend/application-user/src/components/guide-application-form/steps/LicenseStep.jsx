import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';


const LicenseStep = ({
  formData = {
    hasLicense: false,
    feedbackMessage: ''
  }, 
  setFormData, 
  setImages,
  validateErrors,
  setValidateErrors
}) => {
    const [uploadProgress, setUploadProgress] = useState({
        profileImage: 0,
        NICImageFront: 0,
        NICImageBack: 0,
        licenseImageFront: 0,
        licenseImageBack: 0
    });
    const [isUploading, setIsUploading] = useState({
        profileImage: false,
        NICNImageFront: false,
        NICNImageBack: false,
        licenseImageFront: false,
        licenseImageBack: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if(name === 'hasLicense') {
            // Convert string 'true'/'false' to boolean
            const boolValue = value === 'true';
            setFormData(prev => ({
                ...prev,
                [name]: boolValue
            }));
        
            if(!boolValue) {
                setImages(prev => ({
                    ...prev,
                    licenseImageFront: null,
                    licenseImageBack: null
                }));
                setUploadProgress(prev => ({
                    ...prev,
                    licenseImageFront: 0,
                    licenseImageBack: 0
                }));
            }
            if (validateErrors[name]) {
                setValidateErrors(prev => {
                    const updated = {...prev};
                    delete updated[name];
                    return updated;
                });
            }
        } else {
            // Handle other inputs
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));

            // Clear validation errors for this field
            if (validateErrors[name]) {
                setValidateErrors(prev => {
                    const updated = {...prev};
                    delete updated[name];
                    return updated;
                });
            }
        }
    };

    const handleImageChange = async (e, imageKey) => {
        const file = e.target.files[0];
        if (file) {
            // Set uploading state
            setIsUploading(prev => ({
                ...prev,
                [imageKey]: true
            }));
            
            try {
                // Simulate upload progress
                for (let i = 0; i <= 100; i += 10) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    setUploadProgress(prev => ({
                        ...prev,
                        [imageKey]: i
                    }));
                }

                // Update image in parent component
                setImages(prev => ({
                    ...prev,
                    [imageKey]: file
                }));

                // Clear validation errors for this field
                if (validateErrors[imageKey]) {
                    setValidateErrors(prev => {
                        const updated = {...prev};
                        delete updated[imageKey];
                        return updated;
                    });
                }
            } catch (error) {
                console.error('Upload failed:', error);
            } finally {
                setIsUploading(prev => ({
                    ...prev,
                    [imageKey]: false
                }));
            }
        }
    };

    const renderImageUpload = (imageKey, label, isDisabled = false) => (
        <div className={`space-y-2 ${isDisabled ? 'opacity-50' : ''} py-1`}>

            <div>
                <div className="mb-1 text-sm text-secondary">{label}</div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, imageKey)}
                    className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-light file:text-primary hover:file:bg-accent rounded 
                        ${validateErrors[imageKey] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-highlight'} 
                        focus:outline-none focus:ring-2`}
                    disabled={isUploading[imageKey] || isDisabled}
                />
                {validateErrors[imageKey] && (
                    <p className="mt-1 text-sm text-red-500">{validateErrors[imageKey]}</p>
                )}
                {isUploading[imageKey] && (
                    <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-1">
                            <div className="inline-block text-xs font-semibold text-accent">
                                Uploading... {uploadProgress[imageKey]}%
                            </div>
                            <Loader2 className="w-4 h-4 text-accent animate-spin" />
                        </div>
                        <div className="flex h-2 mb-4 overflow-hidden text-xs bg-accent/20 rounded">
                            <div
                                style={{ width: `${uploadProgress[imageKey]}%` }}
                                className="flex flex-col justify-center text-center text-white transition-all duration-300 bg-accent shadow-none whitespace-nowrap"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className='flex flex-row gap-8'>
                <label className='text-lg text-secondary'>Do you have a guide license?</label>
                <div className='flex gap-3'>
                    <input
                        type="radio"
                        id='true'
                        name='hasLicense'
                        value='true'
                        checked={formData.hasLicense === true}
                        onChange={handleInputChange}
                        className="form-radio text-primary"
                        required
                    />
                    <label className='text-lg text-secondary' htmlFor="true">Yes</label>
                </div>
                <div className='flex gap-3'>
                    <input
                        type="radio"
                        id='false'
                        name='hasLicense'
                        value='false'
                        checked={formData.hasLicense === false}
                        onChange={handleInputChange}
                        className="form-radio text-primary"
                        required
                    />
                    <label className='text-lg text-secondary' htmlFor="false">No</label>
                </div>
                {validateErrors.hasLicense && (
                    <p className="text-sm text-red-500">{validateErrors.hasLicense}</p>
                )}
            </div>
            <div className='px-2 border border-secondary'>
                <label className="block text-lg font-medium text-left text-secondary">-License Image-</label>
                <div className='flex gap-5'>
                    {renderImageUpload('licenseImageFront', 'License Image Front Side', !formData.hasLicense)}
                    {renderImageUpload('licenseImageBack', 'License Image Back Side', !formData.hasLicense)}
                </div>
            </div>
            <div className='px-2 border border-secondary'>
                <label className="block text-lg font-medium text-left text-secondary">-Profile Image-</label>
                <div className='flex gap-5'>
                    {renderImageUpload('profileImage', 'Profile Image')}
                </div>
            </div>
            <div className='px-2 border border-secondary'>
                <label className="block text-lg font-medium text-left text-secondary">-NIC(National Identity Card)
                    Image-</label>
                <div className='flex gap-5'>
                    {renderImageUpload('NICImageFront', 'NIC Image Front Side')}
                    {renderImageUpload('NICImageBack', 'NIC Image Back Side')}
                </div>
            </div>

            <div>
                <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-How Do You Know About Us-</label>
                <textarea
                    name="feedbackMessage"
                    value={formData?.feedbackMessage || ''}
                    onChange={handleInputChange}
                    className="w-full h-32 p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-highlight"
                />
            </div>
        </div>
    );

};
export default LicenseStep;