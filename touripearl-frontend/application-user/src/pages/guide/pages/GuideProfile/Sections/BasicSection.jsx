import { MapPin,Mail,Phone,Edit } from "lucide-react";
const BasicSection = ({
    Card,CardHeader,CardTitle,
    setEditMode,editMode,CardContent,
    profile,handleInputChange,EditButtons,
    

}) => {
    return (
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="text-primary dark:text-white">Basic Information</CardTitle>
                <button
                    onClick={() => setEditMode(prev => ({ ...prev, basicInfo: !prev.basicInfo }))}
                    className="p-2 hover:bg-light/20 dark:hover:bg-gray-700 rounded-full"
                >
                    <Edit className="w-4 h-4 text-accent" />
                </button>
            </CardHeader>
            <CardContent className="p-4">
                {editMode.basicInfo ? (
                    <div className="space-y-4">
                        <input
                            className="w-full p-2 border border-secondary rounded bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-highlight"
                            value={profile.firstname || ''}
                            onChange={(e) => handleInputChange('firstname', e.target.value)}
                            placeholder="First Name"
                        />
                        <input
                            className="w-full p-2 border border-secondary rounded bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-highlight"
                            value={profile.lastname || ''}
                            onChange={(e) => handleInputChange('lastname', e.target.value)}
                            placeholder="Last Name"
                        />
                        <input
                            className="w-full p-2 border border-secondary rounded bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-highlight"
                            value={profile.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Phone"
                        />
                        <input
                            className="w-full p-2 border border-secondary rounded bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-highlight"
                            value={profile.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Address"
                        />
                        <input
                            className="w-full p-2 border border-secondary rounded bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-highlight"
                            value={profile.area || ''}
                            onChange={(e) => handleInputChange('area', e.target.value)}
                            placeholder="Area"
                        />
                        <EditButtons section="basicInfo" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-accent"/>
                            <span className="text-secondary dark:text-gray-300">{profile.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-accent"/>
                            <span className="text-secondary dark:text-gray-300">{profile.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-accent"/>
                            <span className="text-secondary dark:text-gray-300">{profile.street}, {profile.city}, {profile.country}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-accent"/>
                            <span className="text-secondary dark:text-gray-300">{profile.zipCode}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BasicSection;
