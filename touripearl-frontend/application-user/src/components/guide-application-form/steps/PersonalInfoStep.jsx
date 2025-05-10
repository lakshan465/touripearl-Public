import React from 'react';

function PersonalInfoStep({ formData, setFormData, validateErrors, setValidateErrors }) {
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'nationality' ? value.toUpperCase() : (type === 'checkbox' ? checked : value)
        }));
        if(errors[name]){
            setErrors(prev=>({...prev, [name]:''}))
        }
    };

    return (
        <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
                {/* First Name */}
                <div>
                    <label className='block py-3 mb-1 text-lg font-medium text-secondary'>-First Name-</label>
                    <input
                        type='text'
                        name='firstname'
                        value={formData.firstname}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${validateErrors.firstname ? 'border-red-500' : 'border-secondary'} rounded focus:outline-none focus:ring-2 focus:ring-highlight`}
                        required
                    />
                    {validateErrors.firstname && <p className="mt-1 text-sm text-red-600">{validateErrors.firstname}</p>}
                </div>

                {/* Last Name */}
                <div>
                    <label className='block py-3 mb-1 text-lg font-medium text-secondary'>-Last Name-</label>
                    <input
                        type='text'
                        name='lastname'
                        value={formData.lastname}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${validateErrors.lastname ? 'border-red-500' : 'border-secondary'} rounded focus:outline-none focus:ring-2 focus:ring-highlight`}
                        required
                    />
                    {validateErrors.lastname && <p className="mt-1 text-sm text-red-600">{validateErrors.lastname}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block py-3 mb-1 text-lg font-medium text-secondary">-Email-</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${validateErrors.email ? 'border-red-500' : 'border-secondary'} rounded focus:outline-none focus:ring-2 focus:ring-highlight`}
                        required
                    />
                    {validateErrors.email && <p className="mt-1 text-sm text-red-600">{validateErrors.email}</p>}
                </div>

                {/* Gender */}
                <div>
                    <label className="block py-3 mb-1 text-lg font-medium text-secondary">-Gender-</label>
                    <div className='flex flex-row gap-8'>
                        <div className='flex gap-2'>
                            <input
                                type="radio"
                                id='male'
                                name='gender'
                                value='MALE'
                                checked={formData.gender === 'MALE'}
                                onChange={handleInputChange}
                                className="text-highlight focus:ring-highlight"
                                required
                            />
                            <label htmlFor="male" className="text-secondary">Male</label>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="radio"
                                id='female'
                                name='gender'
                                value='FEMALE'
                                checked={formData.gender === 'FEMALE'}
                                onChange={handleInputChange}
                                className="text-highlight focus:ring-highlight"
                                required
                            />
                            <label htmlFor="female" className="text-secondary">Female</label>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="radio"
                                id='other'
                                name='gender'
                                value='other'
                                checked={formData.gender === 'other'}
                                onChange={handleInputChange}
                                className="text-highlight focus:ring-highlight"
                                required
                            />
                            <label htmlFor="other" className="text-secondary">Other</label>
                        </div>
                    </div>
                    {validateErrors.gender && <p className="mt-1 text-sm text-red-600">{validateErrors.gender}</p>}
                </div>

                {/* Birthday */}
                <div>
                    <label className="block py-3 mb-1 text-lg font-medium text-secondary">-Birthday-</label>
                    <input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${validateErrors.birthday ? 'border-red-500' : 'border-secondary'} rounded focus:outline-none focus:ring-2 focus:ring-highlight`}
                    />
                    {validateErrors.birthday && <p className="mt-1 text-sm text-red-600">{validateErrors.birthday}</p>}
                </div>

                {/* Nationality */}
                <div>
                    <label className="block py-3 mb-1 text-lg font-medium text-secondary">-Nationality-</label>
                    <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${validateErrors.nationality ? 'border-red-500' : 'border-secondary'} rounded focus:outline-none focus:ring-2 focus:ring-highlight`}
                        required
                    />
                    {validateErrors.nationality && <p className="mt-1 text-sm text-red-600">{validateErrors.nationality}</p>}
                </div>

                {/* Country */}
                <div>
                    <label className="block py-3 mb-1 text-lg font-medium text-secondary">-Country-</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${validateErrors.country ? 'border-red-500' : 'border-secondary'} rounded focus:outline-none focus:ring-2 focus:ring-highlight`}
                        required
                    />
                    {validateErrors.country && <p className="mt-1 text-sm text-red-600">{validateErrors.country}</p>}
                </div>
            </div>
        </div>
    );
}

export default PersonalInfoStep;