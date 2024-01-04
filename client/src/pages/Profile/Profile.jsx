import React, { useContext, useEffect, useState } from 'react';
import './Profile.css'
import ProfileDetails from '../../components/Profile Components/ProfileDetails/ProfileDetails';
import ProfilePosts from '../../components/Profile Components/ProfilePosts/ProfilePosts';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserByUserName } from '../../action/curUser';
import { AppContext } from '../../Context/context';

const Profile = () => {

  const {setProfileUser, setLoading } = useContext(AppContext);
  const queryPerms = useLocation().pathname;
  const navigate = useNavigate();


  const getUserData = async (userName) => {

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
    let query = '';

    for (let i = 1; i < queryPerms.length; i++) {

      if (queryPerms[i] === '/') {
        getUserData(query);
        break;
      }

      query = query + queryPerms[i];
    }
    ;
  }, [queryPerms])

  return (
    <div className="profile-section">
      <ProfileDetails getUserData={getUserData} />
      <ProfilePosts />
    </div>
  );
}

export default Profile;
