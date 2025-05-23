import React from 'react'
import { useState } from 'react'

function ProfessionalInfoStep ({formData, setFormData, validateErrors, setValidateErrors}) {
    const days=['MONDAY', 'TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
    const areas=['AMPARA','ANURADHAPURA','BADULLA','BATTICALO','COLOMBO','GALLE','GAMPAHA','HAMBANTOTA',
                 'JAFFNA','KALUTARA','KANDY','KEGALLE','KURUNEGALA','MANNAR','MATALE','MATARA','MIRISSA',
                 'MONERAGALA','NEGAMBO','NUWARAELIYA','POLONNARUWA','PUTTALAM','RATNAPURA',
                 'TRINCOMALEE','VAVNIYA','YALA']
    const proficiencyLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'FLUENT']
    const languageNames = ['AFRIKAANS', 'ALBANIAN', 'AMHARIC', 'ARABIC', 'ARMENIAN', 
                            'ASSAMESE', 'AZERBAIJANI', 'BASQUE', 'BELARUSIAN', 'BENGALI', 'BOSNIAN', 
                            'BULGARIAN', 'CATALAN', 'CEBUANO', 'CHICHEWA', 'CHINESE', 'CORSICAN', 
                            'CROATIAN', 'CZECH', 'DANISH', 'DUTCH', 'ENGLISH', 'ESPERANTO', 
                            'ESTONIAN', 'FILIPINO', 'FINNISH', 'FRENCH', 'FRISIAN', 'GALICIAN', 
                            'GEORGIAN', 'GERMAN', 'GREEK', 'GUJARATI', 'HAUSA', 'HAWAIIAN', 
                            'HEBREW', 'HINDI', 'HMONG', 'HUNGARIAN', 'ICELANDIC', 'IGBO', 'INDONESIAN', 
                            'IRISH', 'ITALIAN', 'JAPANESE', 'JAVANESE', 'KANNADA', 'KAZAKH', 'KHMER', 
                            'KINYARWANDA', 'KOREAN', 'KURDISH', 'KYRGYZ', 'LAO', 'LATIN', 'LATVIAN', 
                            'LITHUANIAN', 'LUXEMBOURGISH', 'MACEDONIAN', 'MALAGASY', 'MALAY', 'MALAYALAM', 
                            'MALTESE', 'MAORI', 'MARATHI', 'MONGOLIAN', 'NEPALI', 'NORWEGIAN', 'ODIA', 
                            'PASHTO', 'PERSIAN', 'POLISH', 'PORTUGUESE', 'PUNJABI', 'ROMANIAN', 'RUSSIAN',
                            'SAMOA', 'SERBIAN', 'SESOTHO', 'SHONA', 'SINDHI', 'SINHALA', 'SLOVAK', 'SLOVENIAN', 
                            'SOMALI', 'SPANISH', 'SUNDANESE', 'SWAHILI', 'SWEDISH', 'TAJIK', 'TAMIL', 'TATAR', 
                            'TELUGU', 'THAI', 'TURKISH', 'TURKMEN', 'UKRAINIAN', 'URDU', 'UYGHUR', 'UZBEK', 
                            'VIETNAMESE', 'WELSH', 'XHOSA', 'YIDDISH', 'YORUBA', 'ZULU']
    
    const interests = [ 'ADVENTURE_TRAVEL', 'CULTURAL_EXPERIENCES', 'BEACH_GETAWAYS', 'CITY_TOURS', 
                                'HISTORICAL_SITES', 'NATURE_WILDLIFE', 'LUXURY_TRAVEL', 'PHOTOGRAPHY', 'HIKING', 
                                'LOCAL_CUISINE', 'CULTURAL_SITES']

    const [newLanguage, setNewLanguage] = useState({ name: '', level: '' })

    const handleAddLanguage = () => {
      if (newLanguage.name && newLanguage.level) {
          const languageEntry = {
            languageName: newLanguage.name.trim().toUpperCase(),
            languageLevel: newLanguage.level.trim()
          };
          setFormData(prev => ({
              ...prev,
              applicationLanguages: prev.applicationLanguages 
                  ? [...prev.applicationLanguages, languageEntry]
                  : [languageEntry]
          }));
          // Clear any error related to languages once at least one is added
            if (validateErrors.applicationLanguages) {
            setValidateErrors(prev => ({ ...prev, applicationLanguages: undefined }));
  }
          setNewLanguage({ name: '', level: '' }); // Reset input fields
      }
  };
  

  const handleRemoveLanguage = (indexToRemove) => {
    setFormData(prev => ({
        ...prev,
        applicationLanguages: prev.applicationLanguages.filter((_, index) => index !== indexToRemove)
    }));
    
};

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field if it exists
        if (validateErrors[name]) {
            setValidateErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    
    const handleTravelInterestToggle = (interest) => {
        setFormData(prev => {
            const currentInterests = prev.interests || [];
            const newInterests = currentInterests.includes(interest)
                ? currentInterests.filter(item => item !== interest)
                : [...currentInterests, interest];
            
            return {
                ...prev,
                interests: newInterests
            };
        });
    };


    // Function to determine button style based on selection state
    const getTravelInterestButtonStyle = (interest) => {
        const isSelected = formData.interests && formData.interests.includes(interest);
        return isSelected 
            ? "px-4 py-3 w-full text-white bg-purple-500 rounded-md hover:bg-purple-600 transition-colors" 
            : "px-4 py-3 w-full text-secondary border border-secondary rounded-md hover:bg-light/20 transition-colors";
    };

    // Function to format interest name for display
    const formatInterestName = (interest) => {
        return interest
            .replace('_', ' & ')
            .split('_')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-Biography-</label>
                <textarea
                    name="biography"
                    value={formData.biography}
                    onChange={handleInputChange}
                    className={`w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-highlight ${
                        validateErrors.biography ? 'border-red-500' : 'border-secondary'
                    }`}
                />
                {validateErrors.biography && (
                    <p className="mt-1 text-sm text-red-500">{validateErrors.biography}</p>
                )}
            </div>

            <div className="flex flex-row gap-8 space-y-2">
                <div>
                    <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-Languages-</label>
                    <div className="flex gap-2">
                        <select
                            value={newLanguage.name}
                            onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                            className="p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-highlight"
                        >
                            <option value="">Select Language</option>
                            {languageNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <select
                            value={newLanguage.level}
                            onChange={(e) => setNewLanguage(prev => ({ ...prev, level: e.target.value }))}
                            className="p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-highlight"
                        >
                            <option value="">Select Level</option>
                            {proficiencyLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddLanguage}
                            className="px-4 py-2 text-white bg-primary rounded hover:bg-primary/90"
                            type="button"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Display added languages */}
                <div className="w-full">
                    <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">
                        -Added Languages-
                    </label>
                    <div className={`h-32 p-4 overflow-y-auto border rounded-lg bg-light/10 ${
                        validateErrors.applicationLanguages ? 'border-red-500' : 'border-secondary'
                    }`}>
                        {formData.applicationLanguages && formData.applicationLanguages.length > 0 ? (
                            formData.applicationLanguages.map((language, index) => (
                                <div key={index} className="flex items-center justify-between p-2 mt-1 rounded bg-light/20">
                                    <span className="text-secondary">{language.languageName}-{language.languageLevel}</span>
                                    <button
                                        onClick={() => handleRemoveLanguage(index)}
                                        className="px-2 py-1 text-sm text-red-500 hover:text-red-700"
                                        type="button"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No languages added yet</p>
                        )}
                    </div>
                    {validateErrors.applicationLanguages && (
                        <p className="mt-1 text-sm text-red-500">{validateErrors.applicationLanguages}</p>
                    )}
                </div>
            </div>

            {/* Travel Interests Section */}
            <div>
                <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-Travel Interests (Optional)-</label>
                <div className="grid grid-cols-3 gap-4">
                    {interests.map(interest => (
                        <button
                            key={interest}
                            type="button"
                            onClick={() => handleTravelInterestToggle(interest)}
                            className={getTravelInterestButtonStyle(interest)}
                        >
                            {formatInterestName(interest)}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-Working Districts-</label>
                <div className={`grid grid-cols-3 gap-4 p-4 border rounded-lg ${
                    validateErrors.workingAreas ? 'border-red-500' : 'border-secondary'
                }`}>
                    {areas.map(area => (
                        <label key={area} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.workingAreas.includes(area)}
                                onChange={(e) => {
                                    const newAreas = e.target.checked
                                        ? [...formData.workingAreas, area]
                                        : formData.workingAreas.filter(a => a !== area);
                                    setFormData(prev => ({ ...prev, workingAreas: newAreas }));

                                    // Clear validation error when selecting a working area
                                    if (validateErrors.workingAreas && newAreas.length > 0) {
                                        setValidateErrors(prev => ({
                                            ...prev,
                                            workingAreas: undefined
                                        }));
                                    }
                                }}
                                
                            />
                            <span className="text-secondary">{area}</span>
                        </label>
                    ))}
                </div>
                {validateErrors.workingAreas && (
                    <p className="mt-1 text-sm text-red-500">{validateErrors.workingAreas}</p>
                )}
            </div>
            <div>
                <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-Working Days-</label>
                <div className={`space-y-2 p-4 border rounded-lg ${
                    validateErrors.workingDays ? 'border-red-500' : 'border-secondary'
                }`}>
                    {days.map(day => (
                        <label key={day} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.workingDays.includes(day)}
                                onChange={(e) => {
                                    const newDays = e.target.checked
                                        ? [...formData.workingDays, day]
                                        : formData.workingDays.filter(d => d !== day);
                                    setFormData(prev => ({ ...prev, workingDays: newDays }));
                                    
                                    // Clear validation error when selecting a working day
                                    if (validateErrors.workingDays && newDays.length > 0) {
                                        setValidateErrors(prev => ({
                                            ...prev,
                                            workingDays: undefined
                                        }));
                                    }
                                }}
                                
                            />
                            <span className="text-secondary">{day}</span>
                        </label>
                    ))}
                </div>
                {validateErrors.workingDays && (
                    <p className="mt-1 text-sm text-red-500">{validateErrors.workingDays}</p>
                )}
            </div>
            <div>
                <label className="block py-3 mb-1 text-lg font-medium text-left text-secondary">-Extra Information-</label>
                <textarea
                    name="extraInformation"
                    value={formData.extraInformation}
                    onChange={handleInputChange}
                    className={`w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-highlight ${
                        validateErrors.extraInformation ? 'border-red-500' : 'border-secondary'
                    }`}
                />
                {validateErrors.extraInformation && (
                    <p className="mt-1 text-sm text-red-500">{validateErrors.extraInformation}</p>
                )}
            </div>
        </div>
    )
}

export default ProfessionalInfoStep