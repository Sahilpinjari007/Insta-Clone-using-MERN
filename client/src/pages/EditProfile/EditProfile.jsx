import React from 'react';
import './EditProfile.css'
import ProfileSetting from './ProfileSetting/ProfileSetting'
import MainProfileEdit from './MainProfileEdit/MainProfileEdit'

const EditProfile = () => {
  return (
    <div className='editProfile-page'>
      <ProfileSetting/>
      <MainProfileEdit/>
    </div>
  );
}

export default EditProfile;
