import React, { useContext, useEffect, useState } from 'react';
import './Profile.css'
import ProfileDetails from '../../components/Profile Components/ProfileDetails/ProfileDetails';
import ProfilePosts from '../../components/Profile Components/ProfilePosts/ProfilePosts';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getUserByUserName } from '../../action/curUser';
import { AppContext } from '../../Context/context';

const Profile = () => {

  const { setProfileUser, setLoading } = useContext(AppContext);
  const { userName } = useParams();
  const navigate = useNavigate();


  const getUserData = async () => {

    const response = await getUserByUserName(userName);

    if (response.code === 200) {
      setProfileUser(response?.user);
    }
    else {
      navigate('/')
      alert(response.message);
    }
  }

  useEffect(() => {
    setLoading(false);
    getUserData()
  }, [userName])

  return (
    <div className="profile-section">
      <ProfileDetails getUserData={getUserData} />
      <ProfilePosts />
    </div>
  );
}

export default Profile;
