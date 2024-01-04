import React, { useContext, useEffect, useRef, useState } from "react";
import "./ProfileDetails.css";
import ActionButton from "../../ActionButton/ActionButton";
import { AppContext } from '../../../Context/context'
import { checkUserFollowed, followUser, unfollowUser } from "../../../action/curUser";
import { useNavigate } from "react-router-dom";


const ProfileHighlight = () => {

  return (
    <div className="profile-highlight-component">
      <div className="profile-highlight-cover">
        <div className="profile-highlight-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Plus icon"
            className="x1lliihq x1n2onr6 x10xgr34"
            fill="currentColor"
            height={44}
            role="img"
            viewBox="0 0 24 24"
            width={44}
          >
            <title>Plus icon</title>
            <path d="M21 11.3h-8.2V3c0-.4-.3-.8-.8-.8s-.8.4-.8.8v8.2H3c-.4 0-.8.3-.8.8s.3.8.8.8h8.2V21c0 .4.3.8.8.8s.8-.3.8-.8v-8.2H21c.4 0 .8-.3.8-.8s-.4-.7-.8-.7z" />
          </svg>
        </div>
      </div>
      <span className="profile-highilight-title">New</span>
    </div>
  );
};

const ProfileDetails = ({getUserData}) => {

  const { authUser, setLoading, profileUser, setIsAlert, setAleartData } = useContext(AppContext);
  const navigate = useNavigate();

  const [leftHighlightScrollBtn, setLeftHighlightScrollBtn] = useState(false);
  const [rightHighlightScrollBtn, setRightHighlightScrollBtn] = useState(true);
  const [isFollowed, setIsFollowed] = useState(null);

  const highlightRef = useRef();

  const hanldeLefttHighlightScroll = () => {
    highlightRef.current.scrollTo(
      highlightRef.current.scrollLeft - 465.6000061035156,
      0
    );

    if (
      highlightRef.current.scrollLeft == 0 ||
      highlightRef.current.scrollLeft <= 465.6000061035156
    ) {
      setLeftHighlightScrollBtn(false);
    } else {
      setLeftHighlightScrollBtn(true);
    }
    setRightHighlightScrollBtn(true);
  };

  const hanldeRightHighlightScroll = () => {
    highlightRef.current.scrollTo(
      highlightRef.current.scrollLeft + 465.6000061035156,
      0
    )

    setLeftHighlightScrollBtn(true);
  };

  const handleFollowBtn = async () => {

    if (!isFollowed) {
      const currentdate = new Date();

      const response = await followUser({
        followerUserId: profileUser.userId,
        followingUserId: authUser.userId,
        timeStamp: currentdate,
        followerUserFollowerCount: profileUser.Followers,
        followingUserFollwingCount: authUser.Following
      })

      if (response.code !== 200) {
        setAleartData({message: 'Unable to Follow User', type: 'Error'});
      }
      else {
        setIsFollowed(oldValue => !oldValue);
        setAleartData({message: 'User Followed!', type: 'Success'});
      }
      setIsAlert(true);
    }
    else {

      const response = await unfollowUser({
        followerUserId: profileUser.userId,
        followingUserId: authUser.userId,
        followerUserFollowerCount: profileUser.Followers,
        followingUserFollwingCount: authUser.Following
      });

      if (response.code !== 200) {
        setAleartData({message: 'Unable to UnFollow User', type: 'Error'});
      } else {
        setIsFollowed(oldValue => !oldValue);
        setAleartData({message: 'UnFollowed User', type: 'Success'});
      }
      setIsAlert(true);
    }

    getUserData(profileUser.userName);
  }

  const checkUserFollowedOrNOt = async () => {

    const response = await checkUserFollowed({
      followerUserId: profileUser.userId,
      followingUserId: authUser.userId,
    });

    setIsFollowed(response.value);
  }

  const handleShowFollowersBtn = () => {
    if (profileUser.Followers != 0) { setLoading(true); navigate('followers') }
  }

  const handleShowFollowingBtn = () => {
    if (profileUser.Following != 0) { setLoading(true); navigate('following') }
  }

  useEffect(() => {
    if (profileUser.userId !== authUser.userId) {
      checkUserFollowedOrNOt();
    }
  }, [authUser, profileUser]);

  return (
    <div className="profile-content">
      <div className="profile-details">
        <div className="profile-img-section">
          <div className="profile-img-layout">
            <img
              src={profileUser.userProfileImg}
              alt=""
              className="profile-img"
            />
          </div>
        </div>
        <div className="profile-meta-data">
          <div className="profile-meta-content">
            <div className="profile-username-action-btns">
              <span className="profile-username">{profileUser.userName}</span>
              <div className="profile-action-btns">
                {
                  (authUser.userId === profileUser.userId) ?
                    (<><ActionButton path={'/accounts/edit/'} title={"Edit profile"} isUrlBtn={true} />
                      <ActionButton path={''} title={"View archive"} isUrlBtn={true} /></>)
                    : (
                      <>
                        <ActionButton path={''} title={isFollowed ? 'Following' : "Follow"} onclick={handleFollowBtn} isUrlBtn={false} color={isFollowed ? '#363636' : "#0095F6"} />
                        <ActionButton path={''} title={"Message"} isUrlBtn={true} />
                      </>
                    )
                }

              </div>

              <div className="setting-icon">

                {
                  (authUser.userId === profileUser.userId) ? (<svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Options"
                    className="x1lliihq x1n2onr6 x5n08af"
                    fill="currentColor"
                    height={24}
                    role="img"
                    viewBox="0 0 24 24"
                    width={24}
                  >
                    <title>Options</title>
                    <circle
                      cx={12}
                      cy={12}
                      fill="none"
                      r="8.635"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                    <path
                      d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096"
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>) : (<svg
                    aria-label="Options"
                    className="x1lliihq x1n2onr6 x5n08af"
                    fill="currentColor"
                    height={32}
                    role="img"
                    viewBox="0 0 24 24"
                    width={32}
                  >
                    <title>Options</title>
                    <circle cx={12} cy={12} r="1.5" />
                    <circle cx={6} cy={12} r="1.5" />
                    <circle cx={18} cy={12} r="1.5" />
                  </svg>
                  )
                }
              </div>
            </div>
            <div className="profile-user-intraction">
              <span className="user-post">
                <span className="user-post-count">{profileUser.Posts}</span> posts
              </span>

              <span className="user-followers" onClick={handleShowFollowersBtn}>
                <span className="user-followers-count">{profileUser.Followers}</span> followers
              </span>

              <span className="user-following" onClick={handleShowFollowingBtn}>
                <span className="user-following-count">{profileUser.Following}</span> following
              </span>
            </div>
            <span className="profile-sub-username">{profileUser.fullName}</span>
            <pre className="profile-bio">{profileUser.userBio}</pre>
          </div>
        </div>
      </div>

      <div className="profile-highlight-section">
        {leftHighlightScrollBtn && (
          <div
            className="left-highlight-scroll"
            onClick={hanldeLefttHighlightScroll}
          ></div>
        )}

        <div ref={highlightRef} className="profile-highlights">
          <ProfileHighlight />
        </div>

        {rightHighlightScrollBtn && (
          <div
            className="right-highlight-scroll"
            onClick={hanldeRightHighlightScroll}
          ></div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
