import {useState, useEffect} from 'react';
import {Edit2, Save, Mail, Phone, Globe2, Calendar, Clock, Lock, MapPin, User} from 'lucide-react';
import FileUploadModal from "./FileUpload.jsx";
import ChangePasswordPopup from "./ChangePassword.jsx";
import AxiosFetch from "../../utils/axiosFetch.js";
import Cookies from "js-cookie";
import axiosFetch from "../../utils/axiosFetch.js";
import {format, formatDistanceToNow, parseISO} from "date-fns";

export default function UserProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordChange, setPasswordChange] = useState(false);
    const [isFileEditing, setIsFileEditing] = useState(false);
    const id = Cookies.get("UUID");
    const [imageUrl, setImageUrl] = useState('');
    const [profile, setProfile] = useState({});
    const [imgId, setImgId] = useState(null); // Add imgId state
    const [languageLabels, setLanguageLabels] = useState();
    const [interests, setInterests] = useState([]);
    const dateOfJoined = profile?.joinDate ? parseISO(profile.joinDate) : null;
    const dateOfLastActive = profile?.lastActive ? parseISO(profile.lastActive) : null;
    const formattedDate = dateOfJoined ? format(dateOfJoined, "MMMM yyyy") : ""; // "January 2024"
    const timeAgo = dateOfLastActive ? formatDistanceToNow(dateOfLastActive, {addSuffix: true}) : ""; // "2 hours ago"

    useEffect(() => {
        if (isPasswordChange) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isPasswordChange]);

    const getTouristData = async () => {
        try {
            const response = await axiosFetch.get(`api/v1/tourists/${id}`);
            setProfile(response?.data?.object);
            setImageUrl(response?.data?.object?.profileImage?.resourceUrl);
            setImgId(response?.data?.object?.profileImage?.propertyId);
            setLanguageLabels(Object.values(response?.data?.object.languages).join(', '));
            setInterests(response?.data?.object.interests);
            console.log(response?.data?.object);
        } catch (error) {
            console.error("Failed to fetch tourist data:", error);
        }
    };

    useEffect(() => {
        getTouristData();
    }, [id]);

    const handleSave = () => {
        setIsEditing(false);
        try {
            axiosFetch.put(`api/v1/tourists/${id}`, profile)
            alert("Update done")
        } catch (e) {
            alert("error")
        }
        console.log(imageUrl);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("profileImage", file);
        console.log(formData)

        try {
            if (imageUrl) {
                await AxiosFetch.put(`api/v1/profile-images/${imgId}`, formData);
                alert("Image successfully updated.");
            } else {
                const response = await AxiosFetch.post(`api/v1/profile-images/${id}`, formData);
                console.log(response)
                alert("Image successfully uploaded.");
            }
            window.location.reload();
        } catch (error) {
            alert("Failed to upload image");
        }
    };

    const deleteProfilePic = async () => {
        const isConfirm = window.confirm("Are you sure you want to delete your profile picture?");

        if (isConfirm) {
            try {
                await AxiosFetch.delete(`api/v1/profile-images/${imgId}`);
                window.location.reload();
            } catch (error) {
                alert("Something went wrong.");
            }
        }
    };

    const InfoItem = ({icon: Icon, label, value}) => (
        <div className="flex gap-3 text-secondary">
            <Icon size={18} className="text-accent"/>
            <span className="font-medium">{label}:</span>
            <span>{value}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-light/30 p-4 sm:p-8">
            <div
                className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300
                hover:shadow-2xl">
                <div className="bg-primary p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Tourist Profile</h1>
                    <div className="flex gap-2">
                        {isEditing && <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200
                            rounded-md transition-colors"
                        >
                            Cancel
                        </button>}
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-highlight hover:bg-highlight/90
                            text-white transition-colors duration-200"
                        >
                            {isEditing ? (
                                <>
                                    <Save size={20}/>
                                    <span>Save</span>
                                </>
                            ) : (
                                <>
                                    <Edit2 size={20}/>
                                    <span>Edit</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Profile Header */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-8">
                        <div
                            className={`w-32 h-32 shadow-md rounded-full flex items-center justify-center 
                            hover:cursor-pointer ${imageUrl ?
                                "bg-no-repeat bg-cover bg-center" : "bg-[#D9D9D9] text-gray-800"}`}
                            style={imageUrl ? {backgroundImage: `url("${imageUrl}")`} : {}}
                            onClick={() => setIsFileEditing(true)}
                        >
                            {!imageUrl && (
                                <span className="text-4xl font-bold">
                                    {profile.userName ? profile.userName.split(" ").map((word) =>
                                        word[0]).join("") : null}
                                </span>
                            )}
                        </div>
                        {isFileEditing && (
                            <FileUploadModal
                                onClose={() => setIsFileEditing(false)}
                                onFileUpload={handleImageUpload}
                                hasImg={imageUrl}
                                onDelete={deleteProfilePic}
                            />
                        )}

                        <div className="flex-grow space-y-4">
                            {isEditing ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profile.firstName}
                                            onChange={handleChange}
                                            placeholder="First Name"
                                            className="w-full px-4 py-2 rounded-lg border border-secondary
                                            :outline-none focus:ring-2 focus:ring-highlight"
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profile.lastName}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            className="w-full px-4 py-2 rounded-lg border border-secondary
                                            focus:outline-none focus:ring-2 focus:ring-highlight"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="country"
                                        value={profile.location}
                                        onChange={handleChange}
                                        placeholder="Country"
                                        className="w-full px-4 py-2 rounded-lg border border-secondary
                                        focus:outline-none focus:ring-2 focus:ring-highlight"
                                    />
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-primary">{profile.firstName} {profile.lastName}</h2>
                                    <p className="text-secondary flex items-center gap-2">
                                        <span className="inline-block w-4 h-4 rounded-full bg-accent"/>
                                        {profile.country}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Two Sections: Personal and Account */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Personal Section */}
                        <section className="space-y-6">
                            <div className="border-b-2 border-light pb-2">
                                <h3 className="text-xl font-bold text-primary">Personal Details</h3>
                            </div>

                            {/* Address Section */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-primary">Address</h4>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="street"
                                            value={profile.street}
                                            onChange={handleChange}
                                            placeholder="profile Address"
                                            className="w-full px-4 py-2 rounded-lg border border-secondary
                                            focus:outline-none focus:ring-2 focus:ring-highlight"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="city"
                                                value={profile.city}
                                                onChange={handleChange}
                                                placeholder="City"
                                                className="w-full px-4 py-2 rounded-lg border border-secondary
                                                focus:outline-none focus:ring-2 focus:ring-highlight"
                                            />
                                            <input
                                                type="text"
                                                name="state"
                                                value={profile.state}
                                                onChange={handleChange}
                                                placeholder="State/Province"
                                                className="w-full px-4 py-2 rounded-lg border border-secondary
                                                focus:outline-none focus:ring-2 focus:ring-highlight"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={profile.zipCode}
                                            onChange={handleChange}
                                            placeholder="ZIP/Postal Code"
                                            className="w-full px-4 py-2 rounded-lg border border-secondary
                                            focus:outline-none focus:ring-2 focus:ring-highlight"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <InfoItem icon={MapPin} label="Street" value={profile.street}/>
                                        <InfoItem icon={MapPin} label="City" value={profile.city}/>
                                        <InfoItem icon={MapPin} label="State" value={profile.state}/>
                                        <InfoItem icon={MapPin} label="ZIP Code" value={profile.zipCode}/>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-primary mb-2">Bio</h4>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-secondary
                                        focus:outline-none focus:ring-2 focus:ring-highlight min-h-[100px]"
                                    />
                                ) : (
                                    <p className="text-secondary leading-relaxed">{profile.bio}</p>
                                )}
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-primary mb-2">Interests</h4>
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 rounded-full bg-accent/20 text-secondary"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Account Section */}
                        <section className="space-y-6">
                            <div className="border-b-2 border-light pb-2">
                                <h3 className="text-xl font-bold text-primary">Account Details</h3>
                            </div>

                            <div className="space-y-4">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="userName"
                                            value={profile.userName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border border-secondary
                                            focus:outline-none focus:ring-2 focus:ring-highlight"
                                            placeholder="UserName"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border border-secondary
                                            focus:outline-none focus:ring-2 focus:ring-highlight"
                                            placeholder="Email"
                                        />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border border-secondary
                                            focus:outline-none focus:ring-2 focus:ring-highlight"
                                            placeholder="Phone"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <InfoItem icon={User} label="UserName" value={profile.userName}/>
                                        <InfoItem icon={Mail} label="Email" value={profile.email}/>
                                        <InfoItem icon={Phone} label="Phone" value={profile.phone}/>
                                        <InfoItem icon={Globe2} label="Languages" value={languageLabels}/>
                                        <InfoItem icon={Calendar} label="Joined" value={formattedDate}/>
                                        <InfoItem icon={Clock} label="Last Active" value={timeAgo}/>
                                    </div>
                                )}
                            </div>

                            {/* Password Change Button */}
                            <button
                                onClick={() => setPasswordChange(true)}
                                className="w-full px-4 py-2 bg-accent/10 hover:bg-accent/20 text-secondary rounded-lg
                                transition-colors duration-200 flex items-center justify-center gap-2 group"
                            >
                                <Lock size={18} className="group-hover:rotate-12 transition-transform duration-200"/>
                                <span>Change Password</span>
                            </button>
                            {isPasswordChange && <ChangePasswordPopup
                                onClose={() => setPasswordChange(false)}/>}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}