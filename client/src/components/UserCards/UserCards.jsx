import React, { useContext, useEffect, useState } from "react";
import "./UserCards.css";
import ActionButton from "../ActionButton/ActionButton";
import { AppContext } from "../../Context/context";
import { checkUserFollowed, followUser, getUser } from "../../action/curUser";


const UserCards = ({ from, data, setShowRemoveFollowDailog, setDailogData }) => {

  const { authUser, profileUser, setAleartData, setIsAlert } = useContext(AppContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [cardUser, setCardUser] = useState({});

  const checkUserFollowingOrNot = async () => {
    const response = await checkUserFollowed({
      followerUserId: from === 'follow' ? data.followingUserId : data.followerUserId,
      followingUserId: authUser.userId,
    });

    setIsFollowing(response.value);
  };

  const getCardUserData = async () => {
    const response = await getUser(from === 'follow' ? data.followingUserId : data.followerUserId);
    setCardUser(response.result);
  }

  const removFollowBtn = async () => {
    if (authUser.userId === profileUser.userId) {
      setDailogData(data);
      setShowRemoveFollowDailog(true);
      setIsFollowing(false);
    }
    else {
      if (isFollowing) {
        setDailogData(data);
        setShowRemoveFollowDailog(true);
        setIsFollowing(false);
      }
      else {
        const currentdate = new Date();

        const response = await followUser({
          followerUserId: cardUser.userId,
          followingUserId: authUser.userId,
          timeStamp: currentdate,
          followerUserFollowerCount: cardUser.Followers,
          followingUserFollwingCount: authUser.Following
        })

        setIsFollowing(true);

        if (response.code !== 200)
          setAleartData({ message: 'Unable to Follow User!', type: 'Error' })
        else
          setAleartData({ message: 'User Followed!', type: 'Success' });

        setIsAlert(true);
      }
    }
  }

  const followbtnClick = async () => {
    const currentdate = new Date();
    const response = await followUser({
      followerUserId: cardUser.userId,
      followingUserId: authUser.userId,
      timeStamp: currentdate,
      followerUserFollowerCount: cardUser.Followers,
      followingUserFollwingCount: authUser.Following
    })

    if (response.code !== 200)
     { setAleartData({ message: 'Unable to Follow User!', type: 'Error' });}
    else
      {setAleartData({ message: 'User Followed!', type: 'Success' });  setIsFollowing(true);}

    setIsAlert(true);
  }

  useEffect(() => {
    getCardUserData();
    checkUserFollowingOrNot()
  }, [data]);

  return (
    <div className="follow-following-users-card">
      <div className="folw-folwing-user-card-containt">
        <div className="user-img-layout">
          <img src={cardUser.userProfileImg} alt="user pic" className="user-img" />
        </div>
        <div className="user-meta">
          <div className="user-meta-top-section">
            <span className="userName">{cardUser.userName}</span>
            {(!isFollowing && (authUser.userId === profileUser.userId)) && (
              <>
                <div className="sapretor"></div>
                <span className="follow-user-btn" onClick={followbtnClick}>Follow</span>
              </>
            )}
          </div>
          <span className="name">{cardUser.fullName}</span>
        </div>

        {
          cardUser.userId != authUser.userId &&
          (<ActionButton onclick={removFollowBtn} title={authUser.userId === profileUser.userId ? (from === 'follow' ? "Remove" : 'Following') : (isFollowing ? 'Following' : 'Follow')} isUrlBtn={false}
            color={(authUser.userId !== profileUser.userId) ? (isFollowing ? '#363636' : '#0095F6') : '#363636'} />)
        }
      </div>
    </div>
  );
};

export default UserCards;
