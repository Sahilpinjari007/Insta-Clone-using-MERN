import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../Context/context";
import "./Nav.css";
import { checkUserFollowed, followUser, getNotifications, getUser, searchUsers, unfollowUser } from "../../../action/curUser";
import ActionButton from "../../ActionButton/ActionButton";
import moment from "moment";
import { getPost } from "../../../action/post";

const SearchUserCard = ({
  handleUserCardClick,
  data,
  handleClearCardClick,
}) => {
  return (
    <div className="search-user-card">
      <Link to={`/${data.userName}/`}>
        <div
          className="search-user-card-content"
          onClick={() => handleUserCardClick(data)}
        >
          <div
            className={
              data.isHaveStory === "true"
                ? "search-user-img-layout active"
                : "search-user-img-layout"
            }
          >
            <div className="search-user-img">
              <img
                draggable={false}
                src={data.userProfileImg}
                alt={data.userName}
              />
            </div>
          </div>
          <div className="search-user-meta">
            <span className="search-user-username">{data.userName}</span>
            <span className="search-user-name">
              {data.fullName} • {data.Followers} followers
            </span>
          </div>
        </div>
      </Link>
      <div className="clear-search-user-btn-layout">
        <div
          className="clear-search-user-btn"
          onClick={() => handleClearCardClick(data)}
        >
          <svg
            aria-label="Close"
            className="x1lliihq x1n2onr6 x1roi4f4"
            fill="currentColor"
            height={16}
            role="img"
            viewBox="0 0 24 24"
            width={16}
          >
            <title>Close</title>
            <polyline
              fill="none"
              points="20.643 3.357 12 12 3.353 20.647"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
            />
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              x1="20.649"
              x2="3.354"
              y1="20.649"
              y2="3.354"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const UserNotificationMessage = ({ data }) => {

  const { authUser, setAleartData, setIsAlert } = useContext(AppContext);

  const [notifyByUser, setNotifyByUser] = useState({});
  const [isUserFollowed, setIsUserFollowed] = useState(false);
  const [notificationPost, setNotificationPost] = useState({})

  const getNotifyByUser = async () => {
    const response = await getUser(data.notifyByUserId);
    if (response.code === 200) setNotifyByUser(response.result);
  }

  const checkUserFollowedOrNOt = async () => {
    const response = await checkUserFollowed({
      followerUserId: data.notifyByUserId,
      followingUserId: authUser.userId,
    });

    setIsUserFollowed(response.value);
  };

  const handleNotificationBtn = async () => {

    if (!isUserFollowed) {

      const response = await followUser({
        followerUserId: notifyByUser.userId,
        followingUserId: authUser.userId,
        timeStamp: new Date(),
        followerUserFollowerCount: notifyByUser.Followers,
        followingUserFollwingCount: authUser.Following,
      });

      if (response.code !== 200) {
        setAleartData({ message: "Unable to Follow User", type: "Error" });
      } else {
        setIsUserFollowed((oldValue) => !oldValue);
        setAleartData({ message: "User Followed!", type: "Success" });
      }
      setIsAlert(true);
    }
    else {
      const response = await unfollowUser({
        followerUserId: notifyByUser.userId,
        followingUserId: authUser.userId,
        followerUserFollowerCount: notifyByUser.Followers,
        followingUserFollwingCount: authUser.Following,
      });

      if (response.code !== 200) {
        setAleartData({ message: "Unable to UnFollow User", type: "Error" });
      } else {
        setIsUserFollowed((oldValue) => !oldValue);
        setAleartData({ message: "UnFollowed User", type: "Success" });
      }
      setIsAlert(true);
    }

    getNotifyByUser();
  }

  const getNotificationPost = async (postId) => {
    const response = await getPost(postId);
    setNotificationPost(response.result);
  }

  useEffect(() => {
    getNotifyByUser();
    checkUserFollowedOrNOt();
    getNotificationPost(data.LikedPostId);
  }, [data]);


  return (
    <div className="user-notification-message">
      <div className="user-notification-message-content">
        <div className="user-notification-userImg">
          <img
            src={notifyByUser.userProfileImg}
            alt={notifyByUser.userName}
          />
        </div>
        <div className="user-notification-user-meta">
          <span className="user-notification-notification-massage">
            <span className="user-notification-username">
              {notifyByUser.userName}
            </span>{" "}
            {data.message} <span className="message-time">{moment().from(data.timeStamp)}</span>
          </span>
        </div>
        <div className="user-notification-main-content">
          <div className="user-notification-main">
            {data.action === 'userFollow' ? <ActionButton onclick={handleNotificationBtn} isUrlBtn={false} title={isUserFollowed ? 'Following' : 'Follow'} color={isUserFollowed ? "#363636" : "#0095F6"} />
              : notificationPost.postType === 'img' ? <img
                src={notificationPost.isMultiplePost === 'true' ? notificationPost.multipleImgPostURLS[0].url  : notificationPost.singlePostImgURL}
                alt=""
              /> : <video src={notificationPost.postVideoURL}></video>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const Nav = () => {
  const { authUser, setCreatePostDailog } = useContext(AppContext);

  const [showCreateMediaDropDown, setShowCreateMediaDropDown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchIcon, setShowSearchIcon] = useState(true);
  const [showSearchTxt, setShowSearchTxt] = useState(true);
  const [showCancleSearchQuery, setShowCanlceSearchQuery] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchHistoryUsers, setSearchHistoryUsers] = useState([]);
  const [notifiactions, setNotifications] = useState([]);

  const searchInput = useRef(null);

  const [activePage, setActivePage] = useState({
    Home: true,
    Search: false,
    Explore: false,
    Reels: false,
    Messages: false,
    Notifications: false,
    Create: false,
    Profile: false,
  });

  const handleNavItemClick = (key) => {
    setShowCreateMediaDropDown(false);

    if (key !== "Search" && key !== "Notifications") {
      setActivePage({
        ...{
          Home: false,
          Search: false,
          Explore: false,
          Reels: false,
          Messages: false,
          Notifications: false,
          Create: false,
          Profile: false,
        },
        [key]: true,
      });
    } else {
      setActivePage({
        ...{
          Home: false,
          Search: false,
          Explore: false,
          Reels: false,
          Messages: false,
          Notifications: false,
          Create: false,
          Profile: false,
        },
        [key]: !activePage[key],
      });
    }
  };

  const handleSearchOnChange = async (e) => {
    setSearchQuery(e.target.value);
    setShowSearchIcon(false);

    const response = await searchUsers({ searchUser: e.target.value });
    setSearchedUsers(response.result);

    if (e.target.value !== "") {
      setShowSearchTxt(false);
    } else {
      setShowSearchTxt(true);
      setSearchedUsers([]);
    }
  };

  const handleSearchOnFocus = () => {
    setShowSearchIcon(false);
    setShowCanlceSearchQuery(true);
  };

  const handlePlaceHolderClick = () => {
    searchInput?.current?.focus();
  };

  const handleCancleQueryClick = () => {
    setShowSearchIcon(true);
    setShowSearchTxt(true);
    setShowCanlceSearchQuery(false);
    setSearchQuery("");
    setSearchedUsers([]);
  };

  const handleUserCardClick = (user) => {
    if (localStorage.getItem("InstaUserSearchHistory")) {
      let getSearchHistory = JSON.parse(
        localStorage.getItem("InstaUserSearchHistory")
      );

      getSearchHistory = getSearchHistory.filter(
        (elem, i) => elem.userId !== user.userId
      );

      setSearchHistoryUsers([...getSearchHistory, user]);
      localStorage.setItem(
        "InstaUserSearchHistory",
        JSON.stringify([...getSearchHistory, user])
      );
    } else {
      setSearchHistoryUsers([...searchHistoryUsers, user]);
      localStorage.setItem("InstaUserSearchHistory", JSON.stringify([user]));
    }

    setActivePage({
      ...{
        Home: false,
        Search: false,
        Explore: false,
        Reels: false,
        Messages: false,
        Notifications: false,
        Create: false,
        Profile: false,
      },
    });
    setSearchQuery("");
    setShowSearchIcon(true);
    setShowSearchTxt(true);
    setShowCanlceSearchQuery(false);
    setSearchedUsers([]);
  };

  const handleHistoryCardClick = (user) => {
    handleUserCardClick(user);
  };

  const handleClearCardClick = (user) => {
    let getSearchHistory = JSON.parse(
      localStorage.getItem("InstaUserSearchHistory")
    );

    getSearchHistory = getSearchHistory.filter(
      (elem, i) => elem.userId !== user.userId
    );

    setSearchHistoryUsers([...getSearchHistory]);
    localStorage.setItem(
      "InstaUserSearchHistory",
      JSON.stringify([...getSearchHistory])
    );
  };

  const featchNotifications = async () => {
    const response = await getNotifications(authUser.userId);
    if (response.code === 200) setNotifications(Array.from(response.result).reverse());
  }


  useEffect(() => {
    if (localStorage.getItem("InstaUserSearchHistory")) {
      setSearchHistoryUsers(
        JSON.parse(localStorage.getItem("InstaUserSearchHistory")).reverse()
      );
    }

    featchNotifications();
  }, [searchedUsers, authUser]);

  return (
    <div
      className={`app-nav ${activePage.Search || activePage.Notifications ? "activeNavSmall" : ""
        } `}
    >
      <div className="app-nav-content">
        <div className="app-nav-content-intractions">
          <div className="nav-intraction-logo">
            <div className="nav-intraction-logo-content">
              <div className="nav-logo">
                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Instagram"
                    className="x1lliihq x1n2onr6 x5n08af insta-name"
                    fill="currentColor"
                    height={29}
                    role="img"
                    viewBox="32 4 113 32"
                    width={103}
                  >
                    <title>Instagram</title>
                    <path
                      clipRule="evenodd"
                      d="M37.82 4.11c-2.32.97-4.86 3.7-5.66 7.13-1.02 4.34 3.21 6.17 3.56 5.57.4-.7-.76-.94-1-3.2-.3-2.9 1.05-6.16 2.75-7.58.32-.27.3.1.3.78l-.06 14.46c0 3.1-.13 4.07-.36 5.04-.23.98-.6 1.64-.33 1.9.32.28 1.68-.4 2.46-1.5a8.13 8.13 0 0 0 1.33-4.58c.07-2.06.06-5.33.07-7.19 0-1.7.03-6.71-.03-9.72-.02-.74-2.07-1.51-3.03-1.1Zm82.13 14.48a9.42 9.42 0 0 1-.88 3.75c-.85 1.72-2.63 2.25-3.39-.22-.4-1.34-.43-3.59-.13-5.47.3-1.9 1.14-3.35 2.53-3.22 1.38.13 2.02 1.9 1.87 5.16ZM96.8 28.57c-.02 2.67-.44 5.01-1.34 5.7-1.29.96-3 .23-2.65-1.72.31-1.72 1.8-3.48 4-5.64l-.01 1.66Zm-.35-10a10.56 10.56 0 0 1-.88 3.77c-.85 1.72-2.64 2.25-3.39-.22-.5-1.69-.38-3.87-.13-5.25.33-1.78 1.12-3.44 2.53-3.44 1.38 0 2.06 1.5 1.87 5.14Zm-13.41-.02a9.54 9.54 0 0 1-.87 3.8c-.88 1.7-2.63 2.24-3.4-.23-.55-1.77-.36-4.2-.13-5.5.34-1.95 1.2-3.32 2.53-3.2 1.38.14 2.04 1.9 1.87 5.13Zm61.45 1.81c-.33 0-.49.35-.61.93-.44 2.02-.9 2.48-1.5 2.48-.66 0-1.26-1-1.42-3-.12-1.58-.1-4.48.06-7.37.03-.59-.14-1.17-1.73-1.75-.68-.25-1.68-.62-2.17.58a29.65 29.65 0 0 0-2.08 7.14c0 .06-.08.07-.1-.06-.07-.87-.26-2.46-.28-5.79 0-.65-.14-1.2-.86-1.65-.47-.3-1.88-.81-2.4-.2-.43.5-.94 1.87-1.47 3.48l-.74 2.2.01-4.88c0-.5-.34-.67-.45-.7a9.54 9.54 0 0 0-1.8-.37c-.48 0-.6.27-.6.67 0 .05-.08 4.65-.08 7.87v.46c-.27 1.48-1.14 3.49-2.09 3.49s-1.4-.84-1.4-4.68c0-2.24.07-3.21.1-4.83.02-.94.06-1.65.06-1.81-.01-.5-.87-.75-1.27-.85-.4-.09-.76-.13-1.03-.11-.4.02-.67.27-.67.62v.55a3.71 3.71 0 0 0-1.83-1.49c-1.44-.43-2.94-.05-4.07 1.53a9.31 9.31 0 0 0-1.66 4.73c-.16 1.5-.1 3.01.17 4.3-.33 1.44-.96 2.04-1.64 2.04-.99 0-1.7-1.62-1.62-4.4.06-1.84.42-3.13.82-4.99.17-.8.04-1.2-.31-1.6-.32-.37-1-.56-1.99-.33-.7.16-1.7.34-2.6.47 0 0 .05-.21.1-.6.23-2.03-1.98-1.87-2.69-1.22-.42.39-.7.84-.82 1.67-.17 1.3.9 1.91.9 1.91a22.22 22.22 0 0 1-3.4 7.23v-.7c-.01-3.36.03-6 .05-6.95.02-.94.06-1.63.06-1.8 0-.36-.22-.5-.66-.67-.4-.16-.86-.26-1.34-.3-.6-.05-.97.27-.96.65v.52a3.7 3.7 0 0 0-1.84-1.49c-1.44-.43-2.94-.05-4.07 1.53a10.1 10.1 0 0 0-1.66 4.72c-.15 1.57-.13 2.9.09 4.04-.23 1.13-.89 2.3-1.63 2.3-.95 0-1.5-.83-1.5-4.67 0-2.24.07-3.21.1-4.83.02-.94.06-1.65.06-1.81 0-.5-.87-.75-1.27-.85-.42-.1-.79-.13-1.06-.1-.37.02-.63.35-.63.6v.56a3.7 3.7 0 0 0-1.84-1.49c-1.44-.43-2.93-.04-4.07 1.53-.75 1.03-1.35 2.17-1.66 4.7a15.8 15.8 0 0 0-.12 2.04c-.3 1.81-1.61 3.9-2.68 3.9-.63 0-1.23-1.21-1.23-3.8 0-3.45.22-8.36.25-8.83l1.62-.03c.68 0 1.29.01 2.19-.04.45-.02.88-1.64.42-1.84-.21-.09-1.7-.17-2.3-.18-.5-.01-1.88-.11-1.88-.11s.13-3.26.16-3.6c.02-.3-.35-.44-.57-.53a7.77 7.77 0 0 0-1.53-.44c-.76-.15-1.1 0-1.17.64-.1.97-.15 3.82-.15 3.82-.56 0-2.47-.11-3.02-.11-.52 0-1.08 2.22-.36 2.25l3.2.09-.03 6.53v.47c-.53 2.73-2.37 4.2-2.37 4.2.4-1.8-.42-3.15-1.87-4.3-.54-.42-1.6-1.22-2.79-2.1 0 0 .69-.68 1.3-2.04.43-.96.45-2.06-.61-2.3-1.75-.41-3.2.87-3.63 2.25a2.61 2.61 0 0 0 .5 2.66l.15.19c-.4.76-.94 1.78-1.4 2.58-1.27 2.2-2.24 3.95-2.97 3.95-.58 0-.57-1.77-.57-3.43 0-1.43.1-3.58.19-5.8.03-.74-.34-1.16-.96-1.54a4.33 4.33 0 0 0-1.64-.69c-.7 0-2.7.1-4.6 5.57-.23.69-.7 1.94-.7 1.94l.04-6.57c0-.16-.08-.3-.27-.4a4.68 4.68 0 0 0-1.93-.54c-.36 0-.54.17-.54.5l-.07 10.3c0 .78.02 1.69.1 2.09.08.4.2.72.36.91.15.2.33.34.62.4.28.06 1.78.25 1.86-.32.1-.69.1-1.43.89-4.2 1.22-4.31 2.82-6.42 3.58-7.16.13-.14.28-.14.27.07l-.22 5.32c-.2 5.37.78 6.36 2.17 6.36 1.07 0 2.58-1.06 4.2-3.74l2.7-4.5 1.58 1.46c1.28 1.2 1.7 2.36 1.42 3.45-.21.83-1.02 1.7-2.44.86-.42-.25-.6-.44-1.01-.71-.23-.15-.57-.2-.78-.04-.53.4-.84.92-1.01 1.55-.17.61.45.94 1.09 1.22.55.25 1.74.47 2.5.5 2.94.1 5.3-1.42 6.94-5.34.3 3.38 1.55 5.3 3.72 5.3 1.45 0 2.91-1.88 3.55-3.72.18.75.45 1.4.8 1.96 1.68 2.65 4.93 2.07 6.56-.18.5-.69.58-.94.58-.94a3.07 3.07 0 0 0 2.94 2.87c1.1 0 2.23-.52 3.03-2.31.09.2.2.38.3.56 1.68 2.65 4.93 2.07 6.56-.18l.2-.28.05 1.4-1.5 1.37c-2.52 2.3-4.44 4.05-4.58 6.09-.18 2.6 1.93 3.56 3.53 3.69a4.5 4.5 0 0 0 4.04-2.11c.78-1.15 1.3-3.63 1.26-6.08l-.06-3.56a28.55 28.55 0 0 0 5.42-9.44s.93.01 1.92-.05c.32-.02.41.04.35.27-.07.28-1.25 4.84-.17 7.88.74 2.08 2.4 2.75 3.4 2.75 1.15 0 2.26-.87 2.85-2.17l.23.42c1.68 2.65 4.92 2.07 6.56-.18.37-.5.58-.94.58-.94.36 2.2 2.07 2.88 3.05 2.88 1.02 0 2-.42 2.78-2.28.03.82.08 1.49.16 1.7.05.13.34.3.56.37.93.34 1.88.18 2.24.11.24-.05.43-.25.46-.75.07-1.33.03-3.56.43-5.21.67-2.79 1.3-3.87 1.6-4.4.17-.3.36-.35.37-.03.01.64.04 2.52.3 5.05.2 1.86.46 2.96.65 3.3.57 1 1.27 1.05 1.83 1.05.36 0 1.12-.1 1.05-.73-.03-.31.02-2.22.7-4.96.43-1.79 1.15-3.4 1.41-4 .1-.21.15-.04.15 0-.06 1.22-.18 5.25.32 7.46.68 2.98 2.65 3.32 3.34 3.32 1.47 0 2.67-1.12 3.07-4.05.1-.7-.05-1.25-.48-1.25Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </svg>

                  <svg
                    aria-label="Instagram"
                    className="x1lliihq x1n2onr6 x5n08af insta-icon"
                    fill="currentColor"
                    height={24}
                    role="img"
                    viewBox="0 0 24 24"
                    width={24}
                  >
                    <title>Instagram</title>
                    <path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="nav-intraction-btns">
            <div onClick={() => handleNavItemClick("Home")}>
              <div
                className={
                  activePage.Home
                    ? "nav-intraction-btn activeNavItem"
                    : "nav-intraction-btn"
                }
              >
                <span className="nav-intraction-btn-layout">
                  <Link to="/">
                    <div className="nav-intraction-btn-content">
                      <div>
                        <div className="nav-intraction-btn-icon">
                          <div className="nav-intraction-btn-icon-layout">
                            {activePage.Home ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Home"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height={24}
                                role="img"
                                viewBox="0 0 24 24"
                                width={24}
                              >
                                <title>Home</title>
                                <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z" />
                              </svg>
                            ) : (
                              <svg
                                aria-label="Home"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height={24}
                                role="img"
                                viewBox="0 0 24 24"
                                width={24}
                              >
                                <title>Home</title>
                                <path
                                  d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="nav-intraction-btn-lable">
                        <div className="nav-intraction-btn-lable-content">
                          <span>Home</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </span>
              </div>
            </div>

            <div
              onClick={() => handleNavItemClick("Search")}
              className="hideNavItem"
            >
              <div
                className={
                  activePage.Search
                    ? "nav-intraction-btn activeNavItem"
                    : "nav-intraction-btn"
                }
              >
                <span className="nav-intraction-btn-layout contetn-box">
                  <Link>
                    <div className="nav-intraction-btn-content">
                      <div>
                        <div className="nav-intraction-btn-icon">
                          <div className="nav-intraction-btn-icon-layout">
                            {activePage.Search ? (
                              <svg
                                aria-label="Search"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <title>Search</title>
                                <path
                                  d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                ></path>
                                <line
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  x1="16.511"
                                  x2="21.643"
                                  y1="16.511"
                                  y2="21.643"
                                ></line>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Search"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height={24}
                                role="img"
                                viewBox="0 0 24 24"
                                width={24}
                              >
                                <title>Search</title>
                                <path
                                  d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                                <line
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  x1="16.511"
                                  x2={22}
                                  y1="16.511"
                                  y2={22}
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="nav-intraction-btn-lable">
                        <div className="nav-intraction-btn-lable-content">
                          <span>Search</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </span>
              </div>
            </div>

            <div onClick={() => handleNavItemClick("Explore")}>
              <div
                className={
                  activePage.Explore
                    ? "nav-intraction-btn activeNavItem"
                    : "nav-intraction-btn"
                }
              >
                <span className="nav-intraction-btn-layout">
                  <Link>
                    <div className="nav-intraction-btn-content">
                      <div>
                        <div className="nav-intraction-btn-icon">
                          <div className="nav-intraction-btn-icon-layout">
                            {activePage.Explore ? (
                              <svg
                                aria-label="Explore"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <title>Explore</title>
                                <path d="m13.173 13.164 1.491-3.829-3.83 1.49ZM12.001.5a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12.001.5Zm5.35 7.443-2.478 6.369a1 1 0 0 1-.57.569l-6.36 2.47a1 1 0 0 1-1.294-1.294l2.48-6.369a1 1 0 0 1 .57-.569l6.359-2.47a1 1 0 0 1 1.294 1.294Z"></path>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Explore"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height={24}
                                role="img"
                                viewBox="0 0 24 24"
                                width={24}
                              >
                                <title>Explore</title>
                                <polygon
                                  fill="none"
                                  points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                                <polygon
                                  fillRule="evenodd"
                                  points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056"
                                />
                                <circle
                                  cx="12.001"
                                  cy="12.005"
                                  fill="none"
                                  r="10.5"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="nav-intraction-btn-lable">
                        <div className="nav-intraction-btn-lable-content">
                          <span>Explore</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </span>
              </div>
            </div>

            <div onClick={() => handleNavItemClick("Reels")}>
              <div
                className={
                  activePage.Reels
                    ? "nav-intraction-btn activeNavItem"
                    : "nav-intraction-btn"
                }
              >
                <span className="nav-intraction-btn-layout">
                  <Link>
                    <div className="nav-intraction-btn-content">
                      <div>
                        <div className="nav-intraction-btn-icon">
                          <div className="nav-intraction-btn-icon-layout">
                            {activePage.Reels ? (
                              <svg
                                aria-label="Reels"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <title>Reels</title>
                                <path
                                  d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z"
                                  fill-rule="evenodd"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Reels"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height={24}
                                role="img"
                                viewBox="0 0 24 24"
                                width={24}
                              >
                                <title>Reels</title>
                                <line
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  x1="2.049"
                                  x2="21.95"
                                  y1="7.002"
                                  y2="7.002"
                                />
                                <line
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  x1="13.504"
                                  x2="16.362"
                                  y1="2.001"
                                  y2="7.002"
                                />
                                <line
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  x1="7.207"
                                  x2="10.002"
                                  y1="2.11"
                                  y2="7.002"
                                />
                                <path
                                  d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                                <path
                                  d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="nav-intraction-btn-lable">
                        <div className="nav-intraction-btn-lable-content">
                          <span>Reels</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </span>
              </div>
            </div>

            <div
              onClick={() => handleNavItemClick("Messages")}
              className="hideNavItemMessage1"
            >
              <div
                className={
                  activePage.Messages
                    ? "nav-intraction-btn activeNavItem"
                    : "nav-intraction-btn"
                }
              >
                <span className="nav-intraction-btn-layout">
                  <Link>
                    <div className="nav-intraction-btn-content">
                      <div>
                        <div className="nav-intraction-btn-icon">
                          <div className="nav-intraction-btn-icon-layout">
                            {activePage.Messages ? (
                              <svg
                                aria-label="Direct"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <title>Direct</title>
                                <path
                                  d="M22.91 2.388a.69.69 0 0 0-.597-.347l-20.625.002a.687.687 0 0 0-.482 1.178L7.26 9.16a.686.686 0 0 0 .778.128l7.612-3.657a.723.723 0 0 1 .937.248.688.688 0 0 1-.225.932l-7.144 4.52a.69.69 0 0 0-.3.743l2.102 8.692a.687.687 0 0 0 .566.518.655.655 0 0 0 .103.008.686.686 0 0 0 .59-.337L22.903 3.08a.688.688 0 0 0 .007-.692"
                                  fill-rule="evenodd"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Direct"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height={24}
                                role="img"
                                viewBox="0 0 24 24"
                                width={24}
                              >
                                <title>Direct</title>
                                <line
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  x1={22}
                                  x2="9.218"
                                  y1={3}
                                  y2="10.083"
                                />
                                <polygon
                                  fill="none"
                                  points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                                  stroke="currentColor"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="nav-intraction-btn-lable">
                        <div className="nav-intraction-btn-lable-content">
                          <span>Messages</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </span>
              </div>
            </div>

            <div
              onClick={() => handleNavItemClick("Notifications")}
              className="hideNavItem"
            >
              <div
                className={
                  activePage.Notifications
                    ? "nav-intraction-btn activeNavItem"
                    : "nav-intraction-btn"
                }
              >
                <span className="nav-intraction-btn-layout contetn-box">
                  <Link>
                    <div className="nav-intraction-btn-content">
                      <div>
                        <div className="nav-intraction-btn-icon">
                          <div className="nav-intraction-btn-icon-layout">
                            {activePage.Notifications ? (
                              <svg
                                aria-label="Notifications"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <title>Notifications</title>
                                <path d="M17.075 1.987a5.852 5.852 0 0 0-5.07 2.66l-.008.012-.01-.014a5.878 5.878 0 0 0-5.062-2.658A6.719 6.719 0 0 0 .5 8.952c0 3.514 2.581 5.757 5.077 7.927.302.262.607.527.91.797l1.089.973c2.112 1.89 3.149 2.813 3.642 3.133a1.438 1.438 0 0 0 1.564 0c.472-.306 1.334-1.07 3.755-3.234l.978-.874c.314-.28.631-.555.945-.827 2.478-2.15 5.04-4.372 5.04-7.895a6.719 6.719 0 0 0-6.425-6.965Z"></path>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Notifications"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height={24}
                                role="img"
                                viewBox="0 0 24 24"
                                width={24}
                              >
                                <title>Notifications</title>
                                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="nav-intraction-btn-lable">
                        <div className="nav-intraction-btn-lable-content">
                          <span>Notifications</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </span>
              </div>
            </div>

            <div
              onClick={() => setShowCreateMediaDropDown((priVal) => !priVal)}
            >
              <div className="nav-intraction-btn">
                <span className="nav-intraction-btn-layout">
                  <Link>
                    <div className="nav-intraction-btn-content">
                      <div>
                        <div className="nav-intraction-btn-icon">
                          <div className="nav-intraction-btn-icon-layout">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-label="New post"
                              className="x1lliihq x1n2onr6 x5n08af"
                              fill="currentColor"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24"
                            >
                              <title>New post</title>
                              <path
                                d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              />
                              <line
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                x1="6.545"
                                x2="17.455"
                                y1="12.001"
                                y2="12.001"
                              />
                              <line
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                x1="12.003"
                                x2="12.003"
                                y1="6.545"
                                y2="17.455"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="nav-intraction-btn-lable">
                        <div className="nav-intraction-btn-lable-content">
                          <span>Create</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {showCreateMediaDropDown && (
                    <div className="create-media-container">
                      <div className="create-media-container-content">
                        <div className="media-item">
                          <div
                            className="media-item-content"
                            onClick={() => {
                              setCreatePostDailog(true);
                            }}
                          >
                            <span className="media-item-title">Post</span>
                            <svg
                              aria-label="Post"
                              className="x1lliihq x1n2onr6 x5n08af"
                              fill="currentColor"
                              height={24}
                              role="img"
                              viewBox="0 0 24 24"
                              width={24}
                            >
                              <title>Post</title>
                              <path d="m18.509 14.757-4.285-2.474a.857.857 0 0 0-1.286.743v4.948a.857.857 0 0 0 1.286.742l4.285-2.474a.857.857 0 0 0 0-1.485ZM5.225 3.977a1.25 1.25 0 1 0 1.25 1.25 1.25 1.25 0 0 0-1.25-1.25ZM19.5 7.5h-3v-3a4.004 4.004 0 0 0-4-4h-8a4.004 4.004 0 0 0-4 4v8a4.004 4.004 0 0 0 4 4h3v3a4.004 4.004 0 0 0 4 4h8a4.004 4.004 0 0 0 4-4v-8a4.004 4.004 0 0 0-4-4Zm-12 7h-3a1.997 1.997 0 0 1-1.882-1.349l2.607-2.607L7.5 12.819Zm.23-4.28L6.41 8.9a1.679 1.679 0 0 0-2.37 0L2.5 10.44V4.5a2.003 2.003 0 0 1 2-2h8a2.003 2.003 0 0 1 2 2v3h-3a3.992 3.992 0 0 0-3.77 2.72ZM21.5 19.5a2.003 2.003 0 0 1-2 2h-8a2.003 2.003 0 0 1-2-2v-8a2.003 2.003 0 0 1 2-2h8a2.003 2.003 0 0 1 2 2Z" />
                            </svg>
                          </div>
                        </div>

                        <div className="media-item">
                          <div className="media-item-content">
                            <span className="media-item-title">Story</span>
                            <svg
                              aria-label="Post"
                              className="x1lliihq x1n2onr6 x5n08af"
                              fill="currentColor"
                              height={24}
                              role="img"
                              viewBox="0 0 24 24"
                              width={24}
                            >
                              <title>Post</title>
                              <path d="m18.509 14.757-4.285-2.474a.857.857 0 0 0-1.286.743v4.948a.857.857 0 0 0 1.286.742l4.285-2.474a.857.857 0 0 0 0-1.485ZM5.225 3.977a1.25 1.25 0 1 0 1.25 1.25 1.25 1.25 0 0 0-1.25-1.25ZM19.5 7.5h-3v-3a4.004 4.004 0 0 0-4-4h-8a4.004 4.004 0 0 0-4 4v8a4.004 4.004 0 0 0 4 4h3v3a4.004 4.004 0 0 0 4 4h8a4.004 4.004 0 0 0 4-4v-8a4.004 4.004 0 0 0-4-4Zm-12 7h-3a1.997 1.997 0 0 1-1.882-1.349l2.607-2.607L7.5 12.819Zm.23-4.28L6.41 8.9a1.679 1.679 0 0 0-2.37 0L2.5 10.44V4.5a2.003 2.003 0 0 1 2-2h8a2.003 2.003 0 0 1 2 2v3h-3a3.992 3.992 0 0 0-3.77 2.72ZM21.5 19.5a2.003 2.003 0 0 1-2 2h-8a2.003 2.003 0 0 1-2-2v-8a2.003 2.003 0 0 1 2-2h8a2.003 2.003 0 0 1 2 2Z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </span>
              </div>
            </div>

            <div
              onClick={() => handleNavItemClick("Messages")}
              className="hideNavItemMessage2"
            >
              <div
                className={
                  activePage.Messages
                    ? "nav-intraction-btn activeNavItem"
                    : "nav-intraction-btn"
                }
              >
                <span className="nav-intraction-btn-layout">
                  <Link>
                    <div className="nav-intraction-btn-content">
                      <div>
                        <div className="nav-intraction-btn-icon">
                          <div className="nav-intraction-btn-icon-layout">
                            {activePage.Messages ? (
                              <svg
                                aria-label="Direct"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <title>Direct</title>
                                <path
                                  d="M22.91 2.388a.69.69 0 0 0-.597-.347l-20.625.002a.687.687 0 0 0-.482 1.178L7.26 9.16a.686.686 0 0 0 .778.128l7.612-3.657a.723.723 0 0 1 .937.248.688.688 0 0 1-.225.932l-7.144 4.52a.69.69 0 0 0-.3.743l2.102 8.692a.687.687 0 0 0 .566.518.655.655 0 0 0 .103.008.686.686 0 0 0 .59-.337L22.903 3.08a.688.688 0 0 0 .007-.692"
                                  fill-rule="evenodd"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Direct"
                                className="x1lliihq x1n2onr6 x5n08af"
                                fill="currentColor"
                                height={24}
                                role="img"
                                viewBox="0 0 24 24"
                                width={24}
                              >
                                <title>Direct</title>
                                <line
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  x1={22}
                                  x2="9.218"
                                  y1={3}
                                  y2="10.083"
                                />
                                <polygon
                                  fill="none"
                                  points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                                  stroke="currentColor"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="nav-intraction-btn-lable">
                        <div className="nav-intraction-btn-lable-content">
                          <span>Messages</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </span>
              </div>
            </div>

            <div onClick={() => handleNavItemClick("Profile")}>
              <div
                className={
                  activePage.Profile
                    ? "nav-intraction-btn activeNavItem"
                    : "nav-intraction-btn"
                }
              >
                <span className="nav-intraction-btn-layout">
                  <Link to={`/${authUser.userName}/`}>
                    <div className="nav-intraction-btn-content">
                      <div>
                        <div className="nav-intraction-btn-icon">
                          <div className="nav-intraction-btn-icon-layout profile">
                            <div
                              className={
                                activePage.Profile
                                  ? "user-profile-img active"
                                  : "user-profile-img"
                              }
                            >
                              <img
                                src={authUser.userProfileImg}
                                alt={authUser.userName}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="nav-intraction-btn-lable">
                        <div className="nav-intraction-btn-lable-content">
                          <span>Profile</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </span>
              </div>
            </div>
          </div>

          <div className="nav-intraction-other-btns">
            <div onClick={(e) => handleNavItemClick(e)}>
              <div className="nav-intraction-btn">
                <span className="nav-intraction-btn-layout">
                  <Link>
                    <div className="nav-intraction-btn-content">
                      <div>
                        <div className="nav-intraction-btn-icon">
                          <div className="nav-intraction-btn-icon-layout">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-label=""
                              className="x1lliihq x1n2onr6 x5n08af"
                              fill="currentColor"
                              height={24}
                              role="img"
                              viewBox="0 0 192 192"
                              width={24}
                            >
                              <title />
                              <path
                                className="xcslo1z"
                                d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="nav-intraction-btn-lable">
                        <div className="nav-intraction-btn-lable-content">
                          <span>Threads</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </span>
              </div>
            </div>

            <div onClick={(e) => handleNavItemClick(e)}>
              <div className="nav-intraction-btn">
                <span className="nav-intraction-btn-layout">
                  <Link>
                    <div className="nav-intraction-btn-content">
                      <div>
                        <div className="nav-intraction-btn-icon">
                          <div className="nav-intraction-btn-icon-layout">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-label="Settings"
                              className="x1lliihq x1n2onr6 x5n08af"
                              fill="currentColor"
                              height={24}
                              role="img"
                              viewBox="0 0 24 24"
                              width={24}
                            >
                              <title>Settings</title>
                              <line
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                x1={3}
                                x2={21}
                                y1={4}
                                y2={4}
                              />
                              <line
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                x1={3}
                                x2={21}
                                y1={12}
                                y2={12}
                              />
                              <line
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                x1={3}
                                x2={21}
                                y1={20}
                                y2={20}
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="nav-intraction-btn-lable">
                        <div className="nav-intraction-btn-lable-content">
                          <span>More</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="app-nav-content-sections">
          <div className="app-nav-content-section-content">
            <div
              className={`app-nav-search-section ${activePage.Search ? "active" : ""
                } `}
            >
              <div className="app-nav-search-section-content">
                <div className="search-section-header">
                  <div className="search-section-heading">
                    <div className="search-section-heading-content">
                      <h1>Search</h1>
                    </div>
                  </div>

                  <div className="search-section-input">
                    <div className="search-section-input-content">
                      <div
                        className="search-input-placeholder"
                        onClick={handlePlaceHolderClick}
                      >
                        {showSearchIcon && (
                          <div className="search-input-placeholder-icon">
                            <svg
                              aria-label="Search"
                              className="x1lliihq x1n2onr6 x1cp0k07"
                              fill="currentColor"
                              height={16}
                              role="img"
                              viewBox="0 0 24 24"
                              width={16}
                            >
                              <title>Search</title>
                              <path
                                d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                              <line
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                x1="16.511"
                                x2={22}
                                y1="16.511"
                                y2={22}
                              />
                            </svg>
                          </div>
                        )}
                        {showSearchTxt && (
                          <div className="search-input-placeholder-input-text">
                            <span>Search</span>
                          </div>
                        )}
                      </div>
                      <input
                        ref={searchInput}
                        value={searchQuery}
                        onChange={(e) => handleSearchOnChange(e)}
                        onFocus={handleSearchOnFocus}
                        type="text"
                      />
                      {showCancleSearchQuery && (
                        <div
                          onClick={handleCancleQueryClick}
                          className="clear-search-input-btn"
                        ></div>
                      )}
                    </div>
                  </div>
                  <hr />
                </div>
                <div className="search-result">
                  {searchedUsers.length === 0 && (
                    <div className="search-history">
                      <div className="recent-tab">
                        <div className="recent-tab-content">
                          <span>Recent</span>
                          {searchHistoryUsers.length > 0 && (
                            <span
                              className="clear-search-history-btn"
                              onClick={() => {
                                setSearchHistoryUsers([]);
                                localStorage.removeItem(
                                  "InstaUserSearchHistory"
                                );
                              }}
                            >
                              Clear all
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="searched-users">
                        {searchHistoryUsers?.map((elem, i) => {
                          return (
                            <SearchUserCard
                              handleUserCardClick={handleHistoryCardClick}
                              handleClearCardClick={handleClearCardClick}
                              data={elem}
                              key={i}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="search-result-users">
                    {searchedUsers?.map((elem, i) => {
                      return (
                        <SearchUserCard
                          handleUserCardClick={handleUserCardClick}
                          data={elem}
                          key={i}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`app-nav-message-section ${activePage.Notifications ? "active" : ""
                } `}
            >
              <div className="app-nav-message-section-content">
                <div className="app-nav-message-heading">
                  <div className="app-nav-message-heading-content">
                    <span>Notifications</span>
                  </div>
                </div>

                <section className="app-nav-message-contry-section">
                  <div className="app-nav-message-contry-heading">
                    <span>Today</span>
                  </div>
                  {
                    notifiactions?.map((elem, i) => {
                      return new Date(Date.parse(elem.timeStamp)).getDate() == new Date().getDate() && <UserNotificationMessage data={elem} key={i} />
                    })
                  }
                </section>

                <section className="app-nav-message-contry-section">
                  <div className="app-nav-message-contry-section-hr"></div>
                  <div className="app-nav-message-contry-heading">
                    <span>Yesterday</span>
                  </div>
                  {
                    notifiactions?.map((elem, i) => {
                      return new Date(Date.parse(elem.timeStamp)).getDate() == new Date().getDate() - 1 && <UserNotificationMessage data={elem} key={i} />
                    })
                  }
                </section>

                <section className="app-nav-message-contry-section">
                  <div className="app-nav-message-contry-section-hr"></div>
                  <div className="app-nav-message-contry-heading">
                    <span>This week</span>
                  </div>
                  {
                    notifiactions?.map((elem, i) => {
                      return new Date(Date.parse(elem.timeStamp)).getDate() < new Date().getDate() - 1 && <UserNotificationMessage data={elem} key={i} />
                    })
                  }
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
