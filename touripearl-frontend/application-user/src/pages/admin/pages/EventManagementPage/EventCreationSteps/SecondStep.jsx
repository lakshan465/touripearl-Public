const SecondStep = ({
    formData,
    handleChange,
}) => {
const handleHighlightChange = (e, index) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = e.target.value;
    handleChange({ target: { name: 'highlights', value: newHighlights } });
};

return (
    <div className="grid grid-cols-1 gap-4">
        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Start DateTime</label>
            <input type="datetime-local" name="startDateTime" value={formData.startDateTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">End DateTime</label>
            <input type="datetime-local" name="endDateTime" value={formData.endDateTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Venue</label>
            <input type="text" name="venue" value={formData.venue} onChange={handleChange || ''} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Weather Suitability</label>
            <input type="text" name="weatherSuitability" value={formData.weatherSuitability || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Highlights</label>
            {formData.highlights?.map((highlight, index) => (
                <input
                    key={index}
                    type="text"
                    name={`highlight-${index}`}
                    value={highlight}
                    onChange={(e) => handleHighlightChange(e, index)}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 mb-2"
                />
            ))}
            <button
                type="button"
                onClick={() => handleChange({ target: { name: 'highlights', value: [...formData.highlights, ''] } })}
                className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
                Add Highlight
            </button>
        </div>
    </div>
);
};

export default SecondStep;