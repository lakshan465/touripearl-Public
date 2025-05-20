import { Edit,Map,X } from "lucide-react";
const WorkingSection = ({ 
    profile,
    Card,CardHeader,CardTitle,CardContent,
    editMode,setEditMode,
    handleInputChange,
    workingAreas,
    newArea,setNewArea,
    EditButtons
 }) => {
    return (
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="text-primary dark:text-white">Working Areas</CardTitle>
                <button
                    onClick={() => setEditMode(prev => ({ ...prev, workingAreas: !prev.workingAreas }))}
                    className="p-2 hover:bg-light/20 dark:hover:bg-gray-700 rounded-full"
                >
                    <Edit className="w-4 h-4 text-accent" />
                </button>
            </CardHeader>
            <CardContent className="p-4">
                {editMode.workingAreas ? (
                    <div className="space-y-4">
                        {(profile.workingAreas || []).map((area, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="flex-1 p-2 border border-secondary rounded bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200">
                                    {area}
                                </div>
                                <button
                                    onClick={() => {
                                        const newAreas = profile.workingAreas.filter((_, i) => i !== index);
                                        handleInputChange('workingAreas', newAreas);
                                    }}
                                    className="p-2 hover:bg-light/20 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <X className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                        <select
                            value={newArea}
                            onChange={(e) => setNewArea(e.target.value)}
                            className="w-full p-2 border border-secondary rounded bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-highlight"
                        >
                            <option value="" disabled>Select an area</option>
                            {workingAreas.map(area => (
                                <option key={area} value={area}>{area}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                if (newArea && !profile.workingAreas.includes(newArea)) {
                                    handleInputChange('workingAreas', [...(profile.workingAreas || []), newArea]);
                                    setNewArea('');
                                }
                            }}
                            className="px-4 py-2 text-white bg-primary rounded hover:bg-primary/90 transition-colors"
                            type="button"
                        >
                            Add
                        </button>
                        <EditButtons section="workingAreas" />
                    </div>
                ) : (
                    <div className="flex items-center space-x-3">
                        <Map className="w-5 h-5 text-accent" />
                        <div className="flex flex-wrap gap-2">
                            {profile.workingAreas?.map((area, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-light/50 dark:bg-gray-800 text-accent rounded-full text-sm"
                                >
                    {area}
                  </span>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
export default WorkingSection;