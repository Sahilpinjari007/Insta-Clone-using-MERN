import React, { useContext, useEffect, useState } from "react";
import "./RemoveFollowDailog.css";
import { getUser, unfollowUser } from "../../action/curUser";
import { AppContext } from '../../Context/context'

const RemoveFollowDailog = ({ from, data, setShowRemoveFollowDailog }) => {

  const { authUser, setAleartData, setIsAlert } = useContext(AppContext);
  const [cardUser, setCardUser] = useState({});

  const getCardUserData = async () => {
    const response = await getUser(from === 'follow' ? data.followingUserId : data.followerUserId);
    setCardUser(response.result);
  }


  const handleCancleBtnClick = () => {
    setShowRemoveFollowDailog(false);
  };

  const handleMainBtn = async () => {
    if (from === "follow") {
      const response = await unfollowUser({
        followerUserId: authUser.userId,
        followingUserId: cardUser.userId,
        followerUserFollowerCount: authUser.Followers,
        followingUserFollwingCount: cardUser.Following,
      });

      if (response.code !== 200)
        setAleartData({ message: 'Unable to Remove Follow!', type: 'Error' })
      else
        setAleartData({ message: 'Follow Removed', type: 'Success' });

      setShowRemoveFollowDailog(false);
    }
    else {

      const response = await unfollowUser({
        followerUserId: cardUser.userId,
        followingUserId: authUser.userId,
        followerUserFollowerCount: cardUser.Followers,
        followingUserFollwingCount: authUser.Following,
      })

      if (response.code === 200)
        setAleartData({ message: 'UnFollowed User!', type: 'Success' });
      else
        setAleartData({ message: 'Unable to UnFollow User!', type: 'Error' });

      setShowRemoveFollowDailog(false);
    }

    setIsAlert(true);

  };

  useEffect(() => {
    getCardUserData();
  }, []);

  return (
    <div className="remove-follow-dailog">
      <div className="remove-dailog-content">
        <div className="remove-dailog-header">
          <div className="remove-profile-img">
            <img src={cardUser.userProfileImg} alt="profile pic" />
          </div>

          {from === "follow" ? (
            <>
              <h1 className="dailog-heading">Remove follower?</h1>
              <span className="dailog-sub-heading">
                Instagram won't tell {cardUser.fullName} they were removed from your
                followers.
              </span>
            </>
          ) : (
            <h2 className="dailog-heading">Unfollow @{cardUser.userName}?</h2>
          )}
        </div>
        <div className="dailog-btns">
          <button onClick={handleMainBtn} className="dailog-btn">
            {from === "follow" ? "Remove" : "Unfollow"}
          </button>
          <button className="dailog-btn" onClick={handleCancleBtnClick}>
            Cancle
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveFollowDailog;
