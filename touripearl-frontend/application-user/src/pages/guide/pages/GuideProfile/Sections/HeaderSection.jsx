import { Verified } from "lucide-react";
const HeaderSection = ({Card,
                      profile,
                      deleteProfilePic,handleImageUpload,
                      FileUploadModal,setEditMode,
                      setIsFileUpload,
                      isFileUpload
                    }) => {
    return (
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex items-center space-x-6 p-4">
                <div className="relative"
                     onClick={() => setIsFileUpload(true)}
                >
                    {profile?.profileImageUrl?.resourceUrl ? (
                        <img
                            src={profile.profileImageUrl.resourceUrl || '/api/placeholder/128/128'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-2 border-accent"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-light flex items-center justify-center border-2 border-accent">
                        <span className="text-lg font-semibold text-accent">
                            No Image
                        </span>
                        </div>
                    )}
                    {profile.hasLicense && (
                        <div className="absolute bottom-0 right-0">
                            <Verified className="w-6 h-6 text-highlight" />
                        </div>
                    )}
                </div>
                {isFileUpload &&
                    <FileUploadModal
                        onClose={() => setIsFileUpload(false)}
                        onFileUpload={handleImageUpload}
                        hasImg={profile.profileImageUrl}
                        onDelete={deleteProfilePic}
                    />}
                <div className="hover:cursor-pointer"
                     onClick={() => setEditMode(prev => ({ ...prev, basicInfo: !prev.basicInfo }))}
                >
                    <h1 className="text-2xl font-bold text-primary dark:text-white">
                        {profile.firstname} {profile.lastname}
                    </h1>
                    <p className="text-secondary dark:text-gray-300">{profile.nationality}</p>
                </div>
            </div>
        </Card>
    );
}
export default HeaderSection;