import React from 'react'

function ContactDetailsStep({formData, setFormData, validateErrors, setValidateErrors}) {
    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    return (
        <div className='space-y-4'>

            <div>
                <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-Street-</label>
                <textarea className="w-full py-2 pl-3 pr-3 mt-1 text-left border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-highlight" rows={2}
                          name='street'
                          value={formData.street}
                          onChange={handleInputChange}
                />
                {validateErrors.street && <p className="mt-1 text-sm text-red-600">{validateErrors.street}</p>}
            </div>
            <div>
                <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-City-</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${validateErrors.city ? 'border-red-500' : 'border-secondary'} rounded focus:outline-none focus:ring-2 focus:ring-highlight`}
                />
                {validateErrors.city && <p className="mt-1 text-sm text-red-600">{validateErrors.city}</p>}
            </div>
            <div>
                <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-State-</label>
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${validateErrors.state ? 'border-red-500' : 'border-secondary'} rounded focus:outline-none focus:ring-2 focus:ring-highlight`}
                />
                {validateErrors.state && <p className="mt-1 text-sm text-red-600">{validateErrors.state}</p>}
            </div>

            <div>
                <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-Postal Code-</label>
                <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${validateErrors.postalCode ? 'border-red-500' : 'border-secondary'} rounded focus:outline-none focus:ring-2 focus:ring-highlight`}
                />
                {validateErrors.postalCode && <p className="mt-1 text-sm text-red-600">{validateErrors.postalCode}</p>}
            </div>
            <span>
          <div>
            <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-Contact Number-</label>

            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full p-2 border ${validateErrors.phone ? 'border-red-500' : 'border-secondary'} rounded focus:outline-none focus:ring-2 focus:ring-highlight`}
            />
            {validateErrors.phone && <p className="mt-1 text-sm text-red-600">{validateErrors.phone}</p>}
        </div>
      </span>

        </div>
    )
}

export default ContactDetailsStep