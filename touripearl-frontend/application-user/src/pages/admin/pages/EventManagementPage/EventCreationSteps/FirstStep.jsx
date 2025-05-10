const FirstStep = ({ 
    formData,
    handleChange,
 }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Title</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Description</label>
              <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Short Description</label>
              <textarea name="shortDescription" value={formData.shortDescription || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Location</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tip: Add the location from Google Maps by embedding a map.Location {'>'} share {'>'} embed a map <a href="https://maps.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500">Open Google Maps</a></p>
              <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
        </div>
    );
};

export default FirstStep;