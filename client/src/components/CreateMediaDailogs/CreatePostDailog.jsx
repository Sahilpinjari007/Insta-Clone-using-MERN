import React, { useContext, useEffect, useRef, useState } from "react";
import "./CreatePostDailog.css";
import ActionButton from "../ActionButton/ActionButton";
import { AppContext } from "../../Context/context";
import { v4 } from "uuid";
import { getMediaDownloadUrl } from "../../action/getMediaDownloadURL";
import { searchUsers } from "../../action/curUser";
import { createPost } from "../../action/post";
import { uploadMedia } from "../../action/storage";

const CreatePostDailog = () => {
  const imgInput = useRef(null);
  const imgViewr = useRef(null);
  const videoMedia = useRef(null);
  let currentImgIndex = 0;

  const { setCreatePostDailog, authUser, setIsAlert, setAleartData } = useContext(AppContext);
  const [isPostMetaUpdated, setIsPostMetaUpdated] = useState(false);

  const [multiMediaPath, setMultiMediaPath] = useState([]);
  const [showMultiAddMedia, setShowMultiAddMedia] = useState(false);

  const [nextBtnTitle, setNextBtnTitle] = useState("Next");

  const [showDisplayLoader, setShowDisplayLoader] = useState(false);
  const [showCompleteTaskLoader, setShowCompleteTaskLoader] = useState(false);
  const [showUserIntraction, setShowUserIntraction] = useState(true);
  const [showMediaView, setShowMediaView] = useState(false);
  const [showMediaMeta, setShowMediaMeta] = useState(false);

  const [searchMusic, setSearchMusic] = useState(false);
  const [searchMusicQuery, setSearchMusicQuery] = useState("");
  const [showSearchClear, setShowSearchClear] = useState(false);

  const [selectedMusicUrl, setSelectedMusicUrl] = useState("");
  const [selectedMusicTitle, setSelectedMusicTitle] = useState("");
  const [isMusicSelected, setIsMusicSelected] = useState(false);

  const [tagList, setTagList] = useState([]);
  const [searchTag, setSearchTag] = useState(false);
  const [searchTagQuery, setSearchTagQuery] = useState("");
  const [showTagSearchClear, setShowTagSearchClear] = useState(false);
  const [searchtagList, setSearchTagList] = useState([]);

  const [mediaType, setMediaType] = useState("img");
  const [videoUrl, setVideoUrl] = useState("");
  const [isVideoMedia, setIsVideoMedia] = useState(false);
  const [playVideoMedia, setPlayVideoMedia] = useState(false);

  const [mediaMetaData, setMediaMetaData] = useState({
    postId: v4(),
    postUserUserId: authUser.userId,
    postTitle: "",
    postMetaData: "",
    postTimeStamp: new Date(),
    postType: "img",
    postVideoURL: "",
    singlePostImgURL: "",
    isPostContainSong: false,
    postSongTitle: "",
    postSongURL: "",
    isMultiplePost: false,
    multipleImgPostURLS: '[]',
    isPostTaged: false,
    postTagList: '[]',
    postLikes: 0,
  });

  const handleImgInputChnge =  (e) => {
    setShowDisplayLoader(true);
    setShowUserIntraction(false);
    getImgDownloadURL(e.target.files[0]);
  };

  const handleSearchInputChange = (e) => {
    setSearchMusicQuery(e.target.value);

    if (e.target.value === "") {
      setShowSearchClear(false);
    } else {
      setShowSearchClear(true);
    }
  };

  const handleSearchTagInputChange = async (e) => {
    setSearchTagQuery(e.target.value);

    if (e.target.value === "") {
      setShowTagSearchClear(false);
    } else {
      setShowTagSearchClear(true);
    }

    const response = await searchUsers({ searchUser: e.target.value });
    setSearchTagList(response.result);

    if (e.target.value === "") {
      setSearchTagList([]);
    }
  };

  const getImgDownloadURL = async (media) => {

    const response = await uploadMedia(media);
    const result = await response.json();

    if (result.code === 200) {
      if (media.type === "video/mp4" || media.type === "video/x-m4v") {
        setIsVideoMedia(true);
        setVideoUrl(result.url);
        setMediaType("video");

      } else {
        setIsVideoMedia(false);
        setMediaType("img");
        setMultiMediaPath((priVal) => [...priVal, { url: result.url }]);
      }
    }

    setShowMediaView(true);
    setShowDisplayLoader(false);
  };

  const handleSelectMediaBtn = () => {
    imgInput.current.click();
  };

  const handleLeftScroll = () => {
    if (currentImgIndex != 0) {
      currentImgIndex--;

      if (imgViewr.current) {
        imgViewr.current.style.backgroundImage = `url(${multiMediaPath[currentImgIndex].url})`;
      }

      const indicators = Array.from(
        document.querySelectorAll(".selected-img-indicator")
      );

      indicators?.forEach((elem, i) => {
        elem.classList.remove("active");
      });

      indicators[currentImgIndex].classList.add("active");
    }
  };

  const handleRightScroll = () => {
    if (currentImgIndex != multiMediaPath.length - 1) {
      currentImgIndex++;
      imgViewr.current.style.backgroundImage = `url(${multiMediaPath[currentImgIndex].url})`;

      const indicators = Array.from(
        document.querySelectorAll(".selected-img-indicator")
      );

      indicators?.forEach((elem, i) => {
        elem.classList.remove("active");
      });

      indicators[currentImgIndex].classList.add("active");
    }
  };

  const uploadMediaOnProfile = () => {
    if (mediaType === "video") {
      setMediaMetaData({
        ...mediaMetaData,
        postType: "video",
        postVideoURL: videoUrl,
        isPostTaged: tagList.length >= 1 ? true : false,
        postTagList: JSON.stringify(tagList),
      });
    } else {
      setMediaMetaData({
        ...mediaMetaData,
        postType: "img",
        singlePostImgURL: multiMediaPath.length === 1 ? multiMediaPath[0].url : "",
        isPostContainSong: isMusicSelected,
        postSongTitle: selectedMusicTitle,
        postSongURL: selectedMusicUrl,
        isMultiplePost: multiMediaPath.length > 1 ? true : false,
        multipleImgPostURLS: JSON.stringify(multiMediaPath),
        isPostTaged: tagList.length >= 1 ? true : false,
        postTagList: JSON.stringify(tagList),
      });
    }

    setIsPostMetaUpdated(true);
  };

  const nextBtnClick = () => {
    if (nextBtnTitle === "Next") {
      setNextBtnTitle("Share");
      setShowMediaMeta(true);
    } else if (nextBtnTitle === "Share") {
      setNextBtnTitle("Close");
      setShowMediaView(false);
      setShowMediaMeta(false);
      setShowDisplayLoader(true);
      uploadMediaOnProfile();
    }
    else if (nextBtnTitle === "Close") {
      setMultiMediaPath([]);
      setCreatePostDailog((priVal) => !priVal);;
    }
  };

  const backBtnClick = () => {
    if (nextBtnTitle === "Next") {
      setMultiMediaPath([]);
      setCreatePostDailog((priVal) => !priVal);
    } else if (nextBtnTitle === "Share") {
      setNextBtnTitle("Next");
      setShowMediaMeta(false);
    }
  };

  const removeImgFromList = (index) => {
    setMultiMediaPath(multiMediaPath.filter((item, i) => i !== index));

    const indicators = Array.from(
      document.querySelectorAll(".selected-img-indicator")
    );

    indicators?.forEach((elem, i) => {
      elem.classList.remove("active");
    });

    indicators[0].classList.add("active");
  };

  const removeTagsFromList = (elem) => {
    setTagList(tagList?.filter((element) => element != elem));
  };

  const handleVideoMediaControl = () => {
    if (playVideoMedia) {
      setPlayVideoMedia(false);
      videoMedia.current.pause();
    } else {
      setPlayVideoMedia(true);
      videoMedia.current.play();
    }
  };

  const addPostInDb = async (data) => {
    const response = await createPost(data);

    if (response.code === 200) {
      setShowDisplayLoader(false);
      setShowCompleteTaskLoader(true);
      setIsAlert(true);
      setAleartData({ message: 'Post Creaed SuccessFul!', type: 'Success' })
    }
    else {
      setIsAlert(true);
      setAleartData({ message: 'Post Creaed Faild!', type: 'Error' })
    }
  }

  useEffect(() => {
    if (mediaType === "img") {
      if (imgViewr.current) {
        imgViewr.current.style.backgroundImage = `url(${multiMediaPath[0].url})`;
      }
    } else {
      if (videoMedia.current) {
        setPlayVideoMedia(true);
        videoMedia?.current?.play();
      }
    }

    if (isPostMetaUpdated) {
      addPostInDb(mediaMetaData)
    }

  }, [multiMediaPath, videoUrl, mediaType, mediaMetaData, isPostMetaUpdated]);

  return (
    <div className="createpostdailog">
      <div className="createpostdailog-content">
        <input
          onChange={(e) => handleImgInputChnge(e)}
          ref={imgInput}
          type="file"
          accept="image/png, image/gif, image/jpeg, image/*, video/mp4, video/x-m4v, video/*"
          id="img-input"
        />
        <div
          className="close-createpostdailog-icon"
          onClick={() => setCreatePostDailog((priVal) => !priVal)}
        >
          <svg
            aria-label="Close"
            className="x1lliihq x1n2onr6 x9bdzbf"
            fill="currentColor"
            height={18}
            role="img"
            viewBox="0 0 24 24"
            width={18}
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

        <div className="createpostdailog-main-section">
          <div className="createpostdailog-main-content">
            <div className="createpostdailog-header">
              {(multiMediaPath.length > 0 || isVideoMedia) && (
                <div onClick={backBtnClick} className="header-back-icon">
                  <svg
                    aria-label="Back"
                    className="x1lliihq x1n2onr6 x5n08af"
                    fill="currentColor"
                    height={24}
                    role="img"
                    viewBox="0 0 24 24"
                    width={24}
                  >
                    <title>Back</title>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      x1="2.909"
                      x2="22.001"
                      y1="12.004"
                      y2="12.004"
                    />
                    <polyline
                      fill="none"
                      points="9.276 4.726 2.001 12.004 9.276 19.274"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              )}

              <h1 className="createpostdailog-heading">Create new post</h1>

              {(multiMediaPath.length > 0 || isVideoMedia) && (
                <div onClick={nextBtnClick} className="header-next-btn">
                  <span>{nextBtnTitle}</span>
                </div>
              )}
            </div>

            <div className="createpostdailog-intraction-section">
              {showUserIntraction && (
                <div className="createpostdailog-intraction-section-content">
                  <svg
                    aria-label="Icon to represent media such as images or videos"
                    className="x1lliihq x1n2onr6 x5n08af"
                    fill="currentColor"
                    height={77}
                    role="img"
                    viewBox="0 0 97.6 77.3"
                    width={96}
                  >
                    <title>
                      Icon to represent media such as images or videos
                    </title>
                    <path
                      d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                      fill="currentColor"
                    />
                    <path
                      d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                      fill="currentColor"
                    />
                    <path
                      d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                      fill="currentColor"
                    />
                  </svg>

                  <span className="createpostdailog-title">
                    Select photo and videos here
                  </span>

                  <ActionButton
                    title={"Select from computer"}
                    color={"#0095F6"}
                    onclick={handleSelectMediaBtn}
                    isUrlBtn={false}
                  />
                </div>
              )}

              {showMediaView && (
                <div className="view-media-section">
                  <div className="view-media-section-content">
                    {multiMediaPath.length > 1 && (
                      <button
                        onClick={handleLeftScroll}
                        className="media-scroller left-scroller"
                      >
                        <div className="media-scroller-content">
                          <svg
                            aria-label="Left chevron"
                            className="x1lliihq x1n2onr6 x9bdzbf"
                            fill="currentColor"
                            height={16}
                            role="img"
                            viewBox="0 0 24 24"
                            width={16}
                          >
                            <title>Left chevron</title>
                            <polyline
                              fill="none"
                              points="16.502 3 7.498 12 16.502 21"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>
                      </button>
                    )}

                    {!isVideoMedia ? (
                      <div ref={imgViewr} className="media-img"></div>
                    ) : (
                      <div
                        className="media-video"
                        onClick={handleVideoMediaControl}
                      >
                        <video
                          onPause={() => setPlayVideoMedia(false)}
                          src={videoUrl}
                          ref={videoMedia}
                        ></video>
                        <span
                          aria-label="Play"
                          className={
                            playVideoMedia
                              ? "media-video-control-btn"
                              : "media-video-control-btn active"
                          }
                          role="button"
                        ></span>
                      </div>
                    )}

                    {multiMediaPath.length > 1 && (
                      <button
                        onClick={handleRightScroll}
                        className="media-scroller right-scroller"
                      >
                        <div className="media-scroller-content">
                          <svg
                            aria-label="Right chevron"
                            className="x1lliihq x1n2onr6 x9bdzbf"
                            fill="currentColor"
                            height={16}
                            role="img"
                            viewBox="0 0 24 24"
                            width={16}
                          >
                            <title>Right chevron</title>
                            <polyline
                              fill="none"
                              points="8 3 17.004 12 8 21"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>
                      </button>
                    )}

                    <div className="view-media-section-footer">
                      <div className="view-media-footer-content">
                        <div className="add-tags-section">
                          <div className="add-tags-section-content">
                            <button
                              onClick={() => setSearchTag((priVal) => !priVal)}
                              className="select-tag-btn"
                            >
                              <div className="select-tag-btn-content">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-label="Tags"
                                  className="x1lliihq x1n2onr6 x9bdzbf"
                                  fill="currentColor"
                                  height="12"
                                  role="img"
                                  viewBox="0 0 24 24"
                                  width="12"
                                >
                                  <title>Tags</title>
                                  <path d="M21.334 23H2.666a1 1 0 0 1-1-1v-1.354a6.279 6.279 0 0 1 6.272-6.272h8.124a6.279 6.279 0 0 1 6.271 6.271V22a1 1 0 0 1-1 1ZM12 13.269a6 6 0 1 1 6-6 6.007 6.007 0 0 1-6 6Z"></path>
                                </svg>
                              </div>
                            </button>

                            <div
                              className={
                                searchTag
                                  ? "search-tag-container active"
                                  : "search-tag-container"
                              }
                            >
                              <div className="search-tag-container-content">
                                <div className="search-tag-section">
                                  <div className="search-tag-section-content">
                                    <div className="search-label">
                                      <span className="search-tag-label">
                                        Tags:
                                      </span>
                                    </div>
                                    <div className="search-tag-input">
                                      <input
                                        value={searchTagQuery}
                                        onChange={(e) =>
                                          handleSearchTagInputChange(e)
                                        }
                                        type="text"
                                        className="search-song-input"
                                      />

                                      {showTagSearchClear && (
                                        <div
                                          onClick={() => {
                                            setSearchTagQuery("");
                                            setShowTagSearchClear(false);
                                            setSearchTagList([]);
                                          }}
                                          className="remove-search-text-icon"
                                        ></div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="search-tag-result-section">
                                  <div className="search-tag-result-content">
                                    {searchtagList?.map((elem, i) => {
                                      return (
                                        !tagList.includes(elem) && (
                                          <div
                                            key={i}
                                            className="tag-card"
                                            onClick={() => {
                                              tagList.length < 3 &&
                                                setTagList((priVal) => [
                                                  ...priVal,
                                                  elem,
                                                ]);
                                            }}
                                          >
                                            <div className="tag-card-content">
                                              <div className="tag-poster">
                                                <img
                                                  src={elem.userProfileImg}
                                                  alt="user img"
                                                />
                                              </div>
                                              <div className="tag-meta">
                                                <span className="tag-user-userName">
                                                  {elem.userName}
                                                </span>
                                                <span className="tag-user-name">
                                                  {elem.fullName}
                                                </span>
                                              </div>
                                            </div>

                                            <div
                                              className="remove-tag-card-btn"
                                              onClick={() =>
                                                removeTagsFromList(elem)
                                              }
                                            >
                                              <svg
                                                aria-label="Close"
                                                className="x1lliihq x1n2onr6 x9bdzbf"
                                                fill="currentColor"
                                                height={18}
                                                role="img"
                                                viewBox="0 0 24 24"
                                                width={18}
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
                                        )
                                      );
                                    })}

                                    {tagList.length > 0 &&
                                      searchtagList.length === 0 &&
                                      tagList?.map((elem, i) => {
                                        return (
                                          <div className="tag-card" key={i}>
                                            <div className="tag-card-content">
                                              <div className="tag-poster">
                                                <img
                                                  src={elem.userProfileImg}
                                                  alt="user img"
                                                />
                                              </div>
                                              <div className="tag-meta">
                                                <span className="tag-user-userName">
                                                  {elem.userName}
                                                </span>
                                                <span className="tag-user-name">
                                                  {elem.fullName}
                                                </span>
                                              </div>
                                            </div>
                                            <div
                                              className="remove-tag-card-btn active"
                                              onClick={() =>
                                                removeTagsFromList(elem)
                                              }
                                            >
                                              <svg
                                                aria-label="Close"
                                                className="x1lliihq x1n2onr6 x9bdzbf"
                                                fill="currentColor"
                                                height={18}
                                                role="img"
                                                viewBox="0 0 24 24"
                                                width={18}
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
                                        );
                                      })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="selected-img-indicators">
                          {multiMediaPath.length > 1 &&
                            multiMediaPath?.map((elem, i) => {
                              return (
                                <div
                                  key={i}
                                  className={
                                    i == 0
                                      ? "selected-img-indicator active"
                                      : "selected-img-indicator"
                                  }
                                ></div>
                              );
                            })}
                        </div>

                        <div
                          className={
                            showMultiAddMedia
                              ? "add-media-section active"
                              : "add-media-section"
                          }
                        >
                          <div className="add-media-section-content">
                            <div className="media-cards">
                              {multiMediaPath?.map((elem, i) => {
                                return (
                                  <div className="add-media-card" key={i}>
                                    <div
                                      className="media-card-img"
                                      style={{
                                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${elem.url})`,
                                      }}
                                    ></div>
                                    <div
                                      onClick={() => removeImgFromList(i)}
                                      className="remove-media-card-icon"
                                    >
                                      <svg
                                        aria-label="Delete"
                                        className="x1lliihq x1n2onr6 x9bdzbf"
                                        fill="currentColor"
                                        height={12}
                                        role="img"
                                        viewBox="0 0 24 24"
                                        width={12}
                                      >
                                        <title>Delete</title>
                                        <line
                                          fill="none"
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          x1={21}
                                          x2={3}
                                          y1={3}
                                          y2={21}
                                        />
                                        <line
                                          fill="none"
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          x1={21}
                                          x2={3}
                                          y1={21}
                                          y2={3}
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="add-media-btn-section">
                              <div
                                className="add-media-btn"
                                onClick={() => {
                                  imgInput.current.click();
                                }}
                              >
                                <svg
                                  aria-label="Plus icon"
                                  className="x1lliihq x1n2onr6 x1roi4f4"
                                  fill="currentColor"
                                  height={22}
                                  role="img"
                                  viewBox="0 0 24 24"
                                  width={22}
                                >
                                  <title>Plus icon</title>
                                  <path d="M21 11.3h-8.2V3c0-.4-.3-.8-.8-.8s-.8.4-.8.8v8.2H3c-.4 0-.8.3-.8.8s.3.8.8.8h8.2V21c0 .4.3.8.8.8s.8-.3.8-.8v-8.2H21c.4 0 .8-.3.8-.8s-.4-.7-.8-.7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setShowMultiAddMedia((priVal) => !priVal)
                          }
                          className="select-multiple-media-btn"
                        >
                          <div className="select-multiple-media-btn-content">
                            <svg
                              aria-label="Open media gallery"
                              className="x1lliihq x1n2onr6 x9bdzbf"
                              fill="currentColor"
                              height={16}
                              role="img"
                              viewBox="0 0 24 24"
                              width={16}
                            >
                              <title>Open media gallery</title>
                              <path
                                d="M19 15V5a4.004 4.004 0 0 0-4-4H5a4.004 4.004 0 0 0-4 4v10a4.004 4.004 0 0 0 4 4h10a4.004 4.004 0 0 0 4-4ZM3 15V5a2.002 2.002 0 0 1 2-2h10a2.002 2.002 0 0 1 2 2v10a2.002 2.002 0 0 1-2 2H5a2.002 2.002 0 0 1-2-2Zm18.862-8.773A.501.501 0 0 0 21 6.57v8.431a6 6 0 0 1-6 6H6.58a.504.504 0 0 0-.35.863A3.944 3.944 0 0 0 9 23h6a8 8 0 0 0 8-8V9a3.95 3.95 0 0 0-1.138-2.773Z"
                                fillRule="evenodd"
                              />
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`media-meta-data-section ${showMediaMeta ? "active" : ""
                      }`}
                  >
                    <div className="media-meta-data-header">
                      <div className="media-meta-data-header-content">
                        <div className="user-profile-img">
                          <img
                            src={authUser.userProfileImg}
                            alt="profile pic"
                          />
                        </div>
                        <span className="userName">{authUser.userName}</span>
                      </div>
                    </div>

                    <div className="media-caption-section">
                      <div
                        onInput={(e) =>
                          setMediaMetaData({
                            ...mediaMetaData,
                            postTitle: e.target.innerText,
                          })
                        }
                        value={mediaMetaData.postTitle}
                        className="media-caption-area"
                        contentEditable="true"
                        role="textbox"
                        spellCheck="true"
                        tabIndex="0"
                        data-lexical-editor="true"
                      ></div>
                      {mediaMetaData.postTitle == "" && (
                        <div className="media-caption-placeholder">
                          Write a caption...
                        </div>
                      )}

                      <div className="caption-length-count">
                        <span className="caption-max-length">
                          <span className="caption-length">
                            {mediaMetaData.postTitle.length}
                          </span>{" "}
                          / 100
                        </span>
                      </div>
                    </div>

                    <div className="add-location-area">
                      <input
                        placeholder="Add location"
                        type="text"
                        className="location-input"
                        value={mediaMetaData.postMetaData}
                        onChange={(e) =>
                          setMediaMetaData({
                            ...mediaMetaData,
                            postMetaData: e.target.value,
                          })
                        }
                      />
                      <div className="input-icon">
                        <svg
                          aria-label="Add location"
                          className="x1lliihq x1n2onr6 x1roi4f4"
                          fill="currentColor"
                          height={16}
                          role="img"
                          viewBox="0 0 24 24"
                          width={16}
                        >
                          <title>Add location</title>
                          <path d="M12.053 8.105a1.604 1.604 0 1 0 1.604 1.604 1.604 1.604 0 0 0-1.604-1.604Zm0-7.105a8.684 8.684 0 0 0-8.708 8.66c0 5.699 6.14 11.495 8.108 13.123a.939.939 0 0 0 1.2 0c1.969-1.628 8.109-7.424 8.109-13.123A8.684 8.684 0 0 0 12.053 1Zm0 19.662C9.29 18.198 5.345 13.645 5.345 9.66a6.709 6.709 0 0 1 13.417 0c0 3.985-3.944 8.538-6.709 11.002Z" />
                        </svg>
                      </div>
                    </div>

                    <div className="select-song-section">
                      <div className="song-section-content">
                        <div className="song-title-section">
                          <span className="song-title">Add Song</span>
                        </div>
                        <div className="add-song-btn-section">
                          <div
                            className="add-song-btn"
                            onClick={() => setSearchMusic((prival) => !prival)}
                          >
                            <svg
                              aria-label="Plus icon"
                              className="x1lliihq x1n2onr6 x1roi4f4"
                              fill="currentColor"
                              height={22}
                              role="img"
                              viewBox="0 0 24 24"
                              width={22}
                            >
                              <title>Plus icon</title>
                              <path d="M21 11.3h-8.2V3c0-.4-.3-.8-.8-.8s-.8.4-.8.8v8.2H3c-.4 0-.8.3-.8.8s.3.8.8.8h8.2V21c0 .4.3.8.8.8s.8-.3.8-.8v-8.2H21c.4 0 .8-.3.8-.8s-.4-.7-.8-.7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          searchMusic
                            ? "search-song-container active"
                            : "search-song-container"
                        }
                      >
                        <div className="search-song-container-content">
                          <div className="search-song-section">
                            <div className="search-song-section-content">
                              <div className="search-label">
                                <span className="search-song-label">Song:</span>
                              </div>
                              <div className="search-song-input">
                                <input
                                  value={searchMusicQuery}
                                  onChange={(e) => handleSearchInputChange(e)}
                                  type="text"
                                  className="search-song-input"
                                />
                                {showSearchClear && (
                                  <div
                                    onClick={() => {
                                      setShowSearchClear(false);
                                      setSearchMusicQuery("");
                                    }}
                                    className="remove-search-text-icon"
                                  ></div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="search-song-result-section">
                            <div className="search-song-result-content">
                              <div className="song-card">
                                <div className="song-card-content">
                                  <audio src=""></audio>
                                  <div className="song-poster">
                                    <img
                                      src="https://i.scdn.co/image/ab67616d00001e02ae9e865ad220d670cd5cfceb"
                                      alt=""
                                    />
                                  </div>
                                  <div className="song-meta">
                                    <span className="song-title">
                                      Dil Diyan Galla
                                    </span>
                                    <span className="song-meta-data">
                                      Tiger Zinda Hai
                                    </span>
                                  </div>
                                  <div className="play-pause-song-btn">
                                    <div className="play-song-btn"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showDisplayLoader && (
                <div className="display-loader">
                  <img
                    src="https://static.cdninstagram.com/rsrc.php/v3/yC/r/zOjzkNExuht.gif"
                    alt="loading"
                  />
                </div>
              )}

              {showCompleteTaskLoader && (
                <div className="display-complete-task-loader">
                  <img
                    src="https://static.cdninstagram.com/rsrc.php/v3/y5/r/4GCxSJTmyjy.gif"
                    alt="complete task"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostDailog;
