import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/card/Card';
import Loader from '@components/loader/Loader';
import axiosFetch from '@utils/axiosFetch';
import FileUploadModal from '@components/user-profile/FileUpload';
import Cookies from 'js-cookie';
import GuideDashboard from '../../Dashboard/GuideDashboard';
import toast from 'react-hot-toast';
import { BasicSection,BiographySection,LanguageSection,WorkingSection,HeaderSection } from './Sections';
import  {useAuth}  from '@utils/Auth';
import DaysSection from './Sections/DaysSection';

const ProfileEdit = () => {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState({
    basicInfo: false,
    biography: false,
    languages: false,
    workingAreas: false,
    workingDays: false
  });
  const [isFileUpload, setIsFileUpload] = useState(false);
  const id = Cookies.get("UUID");
  const days=['MONDAY', 'TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
  const workingAreas = ['AMPARA', 'ANURADHAPURA', 'BADULLA', 'BATTICALO', 'COLOMBO', 'GALLE', 'GAMPAHA', 'HAMBANTOTA',
    'JAFFNA', 'KALUTARA', 'KANDY', 'KEGALLE', 'KURUNEGALA', 'MANNAR', 'MATALE', 'MATARA', 'MIRISSA',
    'MONERAGALA', 'NEGAMBO', 'NUWARAELIYA', 'POLONNARUWA', 'PUTTALAM', 'RATNAPURA',
    'TRINCOMALEE', 'VAVNIYA', 'YALA'];
  const [newArea, setNewArea] = useState('');
  const proficiencyLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'FLUENT']
  const [newLanguage, setNewLanguage] = useState({ name: '', level: '' });
  const {getUser} =useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axiosFetch('/api/v1/guide/myData');
      console.log(response.data.object)
      setProfile(response.data.object);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleAddLanguage = () => {
    if (newLanguage.name && newLanguage.level) {
      const languageEntry = {
        languageName: newLanguage.name.trim().toUpperCase(),
        languageLevel: newLanguage.level.trim()
      };
      setProfile(prev => ({
          ...prev,
          guideLanguages: prev.guideLanguages 
              ? [...prev.guideLanguages, languageEntry]
              : [languageEntry]
      }));
      setNewLanguage({ name: '', level: '' }); // Reset input fields
  }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    toast.promise(
      async () => {
        profile.profileImageUrl?.propertyId ? await axiosFetch.put(`api/v1/profile-images/${profile.profileImageUrl.propertyId}`, formData) :
        await axiosFetch.post(`api/v1/profile-images/${id}`, formData);
        await getUser();
        fetchProfile();
        //setIsFileUpload(false);
      },{
        success: 'Profile picture uploaded successfully',
        loading: 'Uploading profile picture...',
        error: error => `Failed to upload profile picture: ${error.message}`
      }
    );
  }

  const deleteProfilePic = async () => {
    const isConfirm = window.confirm("Are you sure...");

    if (isConfirm) {
      toast.promise(
        async()=>{
          await axiosFetch.delete(`api/v1/profile-images/${profile.profileImageUrl.propertyId}`)
          await getUser();
          fetchProfile();
        },
        {
          success: 'Profile picture deleted successfully',
          loading: 'Deleting profile picture...',
          error: error => `Failed to delete profile picture: ${error.message}`
        }
      )
    }
  }

  const handleSave = async (section) => {
    toast.promise(
      async () => {
        await axiosFetch.put('/api/v1/guide/updateMyGuideData', profile);
        setEditMode(prev => ({ ...prev, [section]: false }));
        fetchProfile();
      }
      , {
        success: 'Profile updated successfully',
        loading: 'Updating profile...',
        error: error => `Failed to update profile: ${error.message}`
      }
    );

  };

  const EditButtons = ({ section }) => (
      <div className="flex justify-end space-x-2">
        <button
            onClick={() => setEditMode(prev => ({ ...prev, [section]: false }))}
            className="px-4 py-2 border border-secondary rounded bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 hover:bg-light/75 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
            onClick={() => handleSave(section)}
            className="px-4 py-2 bg-highlight text-white rounded hover:bg-highlight/90 transition-colors"
        >
          Save
        </button>
      </div>
  );

  if (isLoading) return <Loader />;

  return (
    <GuideDashboard>
      <div className="w-full max-w-4xl mx-auto space-y-6 text-black">
        {/* Header with Profile Image */}
        <HeaderSection 
              FileUploadModal={FileUploadModal}
              profile={profile}
              deleteProfilePic={deleteProfilePic}
              handleImageUpload={handleImageUpload}
              Card={Card}
              setEditMode={setEditMode}
              setIsFileUpload={setIsFileUpload}
              isFileUpload={isFileUpload}
        />

        {/* Basic Information */}
        <BasicSection
          Card={Card}
          CardContent={CardContent}
          CardHeader={CardHeader}
          CardTitle={CardTitle}
          EditButtons={EditButtons}
          handleInputChange={handleInputChange}
          profile={profile}
          editMode={editMode}
          setEditMode={setEditMode}
        />

        {/* Biography */}
        <BiographySection
          Card={Card}
          CardContent={CardContent}
          CardHeader={CardHeader}
          CardTitle={CardTitle}
          EditButtons={EditButtons}
          handleInputChange={handleInputChange}
          profile={profile}
          editMode={editMode}
          setEditMode={setEditMode}
        />

        {/* Languages and Working Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Languages */}
          <LanguageSection
            profile={profile}
            Card={Card}
            CardHeader={CardHeader}
            CardTitle={CardTitle}
            CardContent={CardContent}
            setEditMode={setEditMode}
            editMode={editMode}
            proficiencyLevels={proficiencyLevels}
            handleInputChange={handleInputChange}
            newLanguage={newLanguage}
            setNewLanguage={setNewLanguage}
            handleAddLanguage={handleAddLanguage}
            EditButtons={EditButtons}
          />

          {/* Working Areas */}
          <WorkingSection
            profile={profile}
            Card={Card}
            CardHeader={CardHeader}
            CardTitle={CardTitle}
            CardContent={CardContent}
            editMode={editMode}
            setEditMode={setEditMode}
            handleInputChange={handleInputChange}
            workingAreas={workingAreas}
            newArea={newArea}
            setNewArea={setNewArea}
            EditButtons={EditButtons}
          />
        </div>

        {/* Working Days */}
        <DaysSection
          profile={profile}
          setProfile={setProfile}
          editMode={editMode}
          setEditMode={setEditMode}
          Card={Card}
          CardHeader={CardHeader}
          CardTitle={CardTitle}
          CardContent={CardContent}
          EditButtons={EditButtons}
          days={days}
          
        />
      </div>
    </GuideDashboard>
  );
};

export default ProfileEdit;