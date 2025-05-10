const UpdateLastStep = ({
    formData,
    handleChange,
})=>{
    return(
        <div className="grid grid-cols-1 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Foreign Price</label>
              <input type="number" name="foreignPrice" value={formData.foreignPrice || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Local Price</label>
              <input type="number" name="localPrice" value={formData.localPrice || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Currency Type</label>
              <input type="text" name="currencyType" value={formData.currencyType || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Wheelchair Accessible</label>
              <input type="checkbox" name="wheelchairAccessible" checked={formData.wheelchairAccessible} onChange={handleChange} className="mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Family Friendly</label>
              <input type="checkbox" name="familyFriendly" checked={formData.familyFriendly} onChange={handleChange} className="mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Senior Friendly</label>
              <input type="checkbox" name="seniorFriendly" checked={formData.seniorFriendly} onChange={handleChange} className="mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Dress Code</label>
              <input type="text" name="dressCode" value={formData.dressCode || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Photography</label>
              <input type="text" name="photography" value={formData.photography || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Minimum Age</label>
              <input type="number" name="minimumAge" value={formData.minimumAge || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
        </div>
    );
};
export default UpdateLastStep;