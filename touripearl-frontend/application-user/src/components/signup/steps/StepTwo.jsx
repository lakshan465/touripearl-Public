import {Phone, Home, MapPin, PenLine, X} from 'lucide-react';
import {useState} from 'react';
import Select from 'react-select';

// Example list of all languages
const allLanguages = [
    {value: 'en', label: 'English'},
    {value: 'it', label: 'Italian'},
    {value: 'ja', label: 'Japanese'},
    {value: 'si', label: 'Sinhala'},
    {value: 'fr', label: 'French'},
    {value: 'de', label: 'German'},
    {value: 'es', label: 'Spanish'},
    {value: 'zh', label: 'Chinese'},
];

const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'France', 'Germany',
    'Japan', 'Spain', 'Italy', 'Brazil', 'India', 'Singapore'
];

const interests = [{
    value: "1", label: "ADVENTURE_TRAVEL"},
    {value: "2", label: "CULTURAL_EXPERIENCES"},
    {value: "3", label: "BEACH_GETAWAYS"},
    {value: "4", label: "CITY_TOURS"},
    {value: "5", label: "HISTORICAL_SITES"},
    {value: "6", label: "NATURE_WILDLIFE"},
    {value: "7", label: "LUXURY_TRAVEL"},
    {value: "8", label: "PHOTOGRAPHY"},
    {value: "9", label: "HIKING"},
    {value: "10", label: "LOCAL_CUISINE"},
    {value: "11", label: "CULTURAL_SITES"}

];

function StepTwo({formData, errors, handleChange, handleInterestToggle, handleLanguageChange}) {
    const [selectedLanguages, setSelectedLanguages] = useState(
        formData.languages ? Object.keys(formData.languages).map(code => ({
            value: code,
            label: formData.languages[code]
        })) : []
    );

    // Handle language selection
    const handleLanguageSelect = (selectedOptions) => {
        setSelectedLanguages(selectedOptions || []);

        // Convert selected languages to a JSON object with only labels
        const languagesObject = selectedOptions.reduce((acc, option) => {
            acc[option.value] = option.label; // Key: language code, Value: language label
            return acc;
        }, {});

        handleLanguageChange(languagesObject); // Pass the JSON object to the parent
    };

    // Handle language removal
    const handleRemoveLanguage = (language) => {
        const updatedLanguages = selectedLanguages.filter(lang => lang.value !== language.value);
        setSelectedLanguages(updatedLanguages);

        // Convert updated languages to a JSON object with only labels
        const updatedLanguagesObject = updatedLanguages.reduce((acc, lang) => {
            acc[lang.value] = lang.label; // Key: language code, Value: language label
            return acc;
        }, {});

        handleLanguageChange(updatedLanguagesObject); // Pass the updated JSON object to the parent
    };

    const renderField = (type, name, label, placeholder, icon) => (
        <div>
            <label className="block text-sm font-medium text-primary">{label}</label>
            <div className="mt-1 relative">
                <input
                    type={type}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${icon && 'pl-11'} rounded-lg border ${errors[name] ?
                        'border-red-500' : 'border-accent'} focus:ring-2 focus:ring-highlight 
                        focus:border-transparent focus:outline-none`}
                    placeholder={placeholder}
                />
                {icon}
                {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {renderField("tel", "phone", "Phone Number", "+1 (555) 123-4567",
                <Phone className="w-5 h-5 text-secondary absolute left-3 top-3.5"/>)}

            <div className="space-y-6">
                {renderField("text", "street", "Street Address",
                    "123 Travel Street",
                    <Home className="w-5 h-5 text-secondary absolute left-3 top-3.5"/>)}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderField("text", "city", "City", "City", null)}
                    {renderField("text", "state", "State/Province", "State", null)}
                    {renderField("text", "zipCode", "ZIP/Postal Code", "ZIP Code", null)}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-primary">Country</label>
                <div className="mt-1 relative">
                    <select
                        name="country"
                        value={formData.country || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.country ?
                            'border-red-500' : 'border-accent'} focus:ring-2 focus:ring-highlight 
                            focus:border-transparent bg-white focus:outline-none`}
                    >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                    <MapPin className="w-5 h-5 text-secondary absolute left-3 top-3.5"/>
                    {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-primary">Languages</label>
                <div className="mt-1">
                    {/* Display selected languages as badges above the dropdown */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {selectedLanguages.map((language) => (
                            <div
                                key={language.value}
                                className="relative flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-secondary group"
                                onMouseEnter={(e) => e.currentTarget.querySelector('.remove-icon').classList.remove('hidden')}
                                onMouseLeave={(e) => e.currentTarget.querySelector('.remove-icon').classList.add('hidden')}
                            >
                                <span>{language.label}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLanguage(language)}
                                    className="remove-icon hidden text-red-500 hover:text-red-700"
                                >
                                    <X size={14}/>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Multi-select dropdown for languages */}
                    <Select
                        isMulti
                        options={allLanguages}
                        value={selectedLanguages}
                        onChange={handleLanguageSelect}
                        placeholder="Select languages..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                        hideSelectedOptions
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: errors.languages ? '#EF4444' : '#6998AB',
                                borderRadius: '8px',
                                padding: '4px',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: '#9A55F3',
                                },
                            }),
                            multiValue: (base) => ({
                                ...base,
                                display: 'none',
                            }),
                        }}
                    />
                    {errors.languages && <p className="mt-1 text-sm text-red-500">{errors.languages}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-primary">Biography</label>
                <div className="mt-1 relative">
                    <textarea
                        name="bio"
                        value={formData.bio || ''}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.bio ?
                            'border-red-500' : 'border-accent'} focus:ring-2 focus:ring-highlight 
                            focus:border-transparent focus:outline-none`}
                        placeholder="Tell us about yourself and your travel experiences..."
                    />
                    <PenLine className="w-5 h-5 text-secondary absolute left-3 top-5"/>
                    {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-primary mb-2">Travel Interests (Optional)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interests.map((interest) => (
                        <button
                            key={interest.value}
                            type="button"
                            onClick={() => handleInterestToggle(interest)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                formData.interests[interest.value]
                                    ? 'bg-highlight text-white'
                                    : 'bg-white border border-accent text-secondary hover:bg-light/20'
                            }`}
                        >
                            {interest.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StepTwo;