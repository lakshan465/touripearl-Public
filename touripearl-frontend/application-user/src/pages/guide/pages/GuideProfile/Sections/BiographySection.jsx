import { Edit,FileText } from "lucide-react";
const BiographySection = ({
    Card,CardHeader,CardTitle,CardContent,
    setEditMode,handleInputChange,editMode,
    profile,EditButtons
}) =>{return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-primary dark:text-white">About Me</CardTitle>
            <button
                onClick={() => setEditMode(prev => ({ ...prev, biography: !prev.biography }))}
                className="p-2 hover:bg-light/20 dark:hover:bg-gray-700 rounded-full"
            >
                <Edit className="w-4 h-4 text-accent" />
            </button>
        </CardHeader>
        <CardContent className="p-4">
            {editMode.biography ? (
                <div className="space-y-4">
            <textarea
                className="w-full p-2 border border-secondary rounded bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-highlight"
                value={profile.biography || ''}
                onChange={(e) => handleInputChange('biography', e.target.value)}
                rows={6}
            />
                    <EditButtons section="biography" />
                </div>
            ) : (
                <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-accent mt-1" />
                    <p className="text-secondary dark:text-gray-300">{profile.biography}</p>
                </div>
            )}
        </CardContent>
    </Card>
);
};

export default BiographySection;