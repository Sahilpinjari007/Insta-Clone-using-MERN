import React, { useContext, useEffect, useRef, useState } from "react";
import "./Post.css";
import { Link } from "react-router-dom";
import { getUser } from "../../../../../../action/curUser";
import moment from "moment";
import {
  checkPostLiked,
  checkPostSaved,
  commentOnPost,
  fetchPostLikedUsers,
  likePost,
  savePost,
} from "../../../../../../action/post";
import { AppContext } from "../../../../../../Context/context";

const Post = ({ postData }) => {
  const { authUser, setIsAlert, setAleartData, setSendPostDailog, setViewUserMedia, setViewUserMediaData } = useContext(AppContext);

  const [comment, setComment] = useState("");
  const [songSituation, setSongSituation] = useState(false);
  const [postLike, setPostLike] = useState(false);
  const [postSave, setPostSave] = useState(false);
  const [videoSituation, setVideoSituation] = useState(true);
  const [showMoreTitle, setShowMoreTitle] = useState(false);
  const [showLeftPostScrollBtn, setShowLeftPostScrollBtn] = useState(false);
  const [showRightPostScrollBtn, setShowRightPostScrollBtn] = useState(true);
  const [postScrollValue, setPostScrollValue] = useState(0);
  const [activeMultiplePost, setActiveMultiplePost] = useState(0);
  const [postUser, setPostUser] = useState({});
  const [postLikedUsers, setPostLikedUsers] = useState([]);

  const videoElement = useRef();
  const audioElement = useRef();
  const MultiplePostsSection = useRef();

  const handleCommentPost = async () => {
    if (comment !== "") {
      const response = await commentOnPost({
        postId: postData.postId,
        postUserId: postData.postUserUserId,
        commentedUserId: authUser.userId,
        message: comment,
        timeStamp: new Date(),
      });

      if (response.code !== 200) {
        setIsAlert(true);
        setAleartData({ message: "Unable to Post Comment!", type: "Error" });
      }

      setComment("");
      console.log(response);
    } else {
      setIsAlert(true);
      setAleartData({ message: "Unable to Post Comment!", type: "Error" });
    }
  };

  const playPauseSong = () => {
    if (postData.isPostContainSong) {
      if (songSituation) {
        setSongSituation(false);
        audioElement.current.pause();
      } else {
        setSongSituation(true);
        audioElement.current.play();
      }
    } else {
      if (postData.postType === "video") {
        if (songSituation) {
          setSongSituation(false);
          videoElement.current.muted = true;
        } else {
          setSongSituation(true);
          videoElement.current.muted = false;
        }
      }
    }
  };

  const handlePostLike = async () => {
    const response = await likePost({
      postId: postData.postId,
      likedUserId: authUser.userId,
      postUserId: postData.postUserUserId,
      postLikes: postData.postLikes,
    });

    if (response.code === 200) {
      setPostLike(response?.value);

      if (response.value) postData.postLikes = postData.postLikes + 1;
      else postData.postLikes = postData.postLikes - 1;
    } else {
      setIsAlert(true);
      setAleartData({ message: "Unable to Like Post!", type: "Error" });
    }
  };

  const handlePostSave = async () => {
    const response = await savePost({
      postId: postData.postId,
      userId: authUser.userId,
    });

    if (response.code === 200) {
      setPostSave(response?.value);
    } else {
      setIsAlert(true);
      setAleartData({ message: "Unable to Save Post!", type: "Error" });
    }
  };

  const handleVideoSituation = () => {
    if (videoSituation) {
      videoElement.current.play();
      setVideoSituation(false);
    } else {
      videoElement.current.pause();
      setVideoSituation(true);
    }
  };

  const handlePostRightScroll = () => {
    setPostScrollValue(postScrollValue + 465.6000061035156);
    MultiplePostsSection.current.scrollTo(
      postScrollValue + 465.6000061035156,
      0
    );

    if (activeMultiplePost + 1 < postData.multipleImgPostURLS.length) {
      setActiveMultiplePost(activeMultiplePost + 1);

      if (activeMultiplePost != postData.multipleImgPostURLS.length - 2) {
        setShowRightPostScrollBtn(true);
      } else {
        setShowRightPostScrollBtn(false);
      }
    }
  };

  const handlePostLeftScroll = () => {
    setPostScrollValue(postScrollValue - 465.6000061035156);
    MultiplePostsSection.current.scrollTo(
      postScrollValue - 465.6000061035156,
      0
    );
    if (activeMultiplePost - 1 >= 0) {
      setActiveMultiplePost(activeMultiplePost - 1);
      setShowRightPostScrollBtn(true);
    }
  };

  const getPostUser = async () => {
    const response = await getUser(postData.postUserUserId);
    setPostUser(response.result);
  };

  const checkPostLikedOrNot = async () => {
    const response = await checkPostLiked({
      postId: postData.postId,
      likedUserId: authUser.userId,
      postUserId: postData.postUserUserId,
    });
    setPostLike(response.value);
  };

  const checkPostSavedOrNot = async () => {
    const response = await checkPostSaved({
      postId: postData.postId,
      userId: authUser.userId,
    });

    if (response.code === 200) {
      setPostSave(response?.value);
    }
  };

  const getPostLikedUsers = async () => {
    const response = await fetchPostLikedUsers({
      postId: postData.postId,
      authUserId: authUser.userId,
    });

    setPostLikedUsers(response.result);
  };

  const handleViewComment = () =>{
    setViewUserMedia(true);
    setViewUserMediaData(postData);
  }

  useEffect(() => {
    if (postScrollValue > 0) {
      setShowLeftPostScrollBtn(true);
    } else {
      setShowLeftPostScrollBtn(false);
    }

    getPostUser();
    checkPostLikedOrNot();
    getPostLikedUsers();
    checkPostSavedOrNot();
  }, [postData, postScrollValue]);

  return (
    <div className="post">
      <div className="post-content">
        <div className="post-audio">
          <audio loop ref={audioElement} src={postData.postSongURL}></audio>
        </div>

        <div className="post-header">
          <div className="post-user-img">
            <div
              className={
                postUser.isHaveStory
                  ? "post-user-img-layout activeStory"
                  : "post-user-img-layout"
              }
            >
              <img src={postUser.userProfileImg} alt="img not found" />
            </div>
          </div>

          <div className="post-user-details">
            <div className="post-user-username-time">
              <span className="post-user-username">{postUser.userName}</span>
              <span className="post-sapretor">•</span>
              <span className="post-time">
                {moment().from(postData.postTimeStamp)}
              </span>
            </div>
            <span className="post-other-meta-data">
              {postData.postMetaData}
            </span>
          </div>

          <div className="post-more">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-label="More options"
              className="x1lliihq x1n2onr6 x5n08af"
              fill="currentColor"
              height="24"
              role="img"
              viewBox="0 0 24 24"
              width="24"
            >
              <title>More options</title>
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="6" cy="12" r="1.5" />
              <circle cx="18" cy="12" r="1.5" />
            </svg>
          </div>
        </div>

        <div className="main-post">
          {postData.postType === "img" ? (
            <div className="main-post-layout" ref={MultiplePostsSection}>
              {postData.isMultiplePost === "false" ? (
                <div className="post-img-layout">
                  <img src={postData.singlePostImgURL} alt="No image Found!" />
                </div>
              ) : (
                postData.multipleImgPostURLS?.map((elem, i) => {
                  return (
                    <div className="post-img-layout" key={i}>
                      <img src={elem.url} alt={postData.postTitle} />
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="video-post">
              {videoSituation && <div className="pause-video-btn"></div>}
              <video
                muted
                onClick={handleVideoSituation}
                loop
                ref={videoElement}
                src={postData.postVideoURL}
              ></video>
            </div>
          )}

          {postData.isMultiplePost === "true" && (
            <>
              {showLeftPostScrollBtn && (
                <div
                  className="left-post-scroll"
                  onClick={handlePostLeftScroll}
                ></div>
              )}
              {showRightPostScrollBtn && (
                <div
                  className="right-post-scroll"
                  onClick={handlePostRightScroll}
                ></div>
              )}
            </>
          )}

          <div className="bottom-post-navigation">
            <div className="bottom-post-navigation-section">
              {postData.isPostTaged === "true" && (
                <div className="tag-icon">
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
                    <path d="M21.334 23H2.666a1 1 0 0 1-1-1v-1.354a6.279 6.279 0 0 1 6.272-6.272h8.124a6.279 6.279 0 0 1 6.271 6.271V22a1 1 0 0 1-1 1ZM12 13.269a6 6 0 1 1 6-6 6.007 6.007 0 0 1-6 6Z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="bottom-post-navigation-section">
              {postData.isMultiplePost === "true" && (
                <div className="posts-count-thumb">
                  {postData.multipleImgPostURLS?.map((elem, i) => {
                    return (
                      <div
                        key={i}
                        className={
                          activeMultiplePost == i
                            ? "current-post-count-thumb active"
                            : "current-post-count-thumb"
                        }
                      ></div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bottom-post-navigation-section">
              {(postData.postType === "video" ||
                postData.isPostContainSong === "true") && (
                  <div className="play-pause-mp3-icon" onClick={playPauseSong}>
                    {songSituation ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Audio is playing"
                        className="x1lliihq x1n2onr6 x9bdzbf"
                        fill="currentColor"
                        height="12"
                        role="img"
                        viewBox="0 0 24 24"
                        width="12"
                      >
                        <title>Audio is playing</title>
                        <path d="M16.636 7.028a1.5 1.5 0 1 0-2.395 1.807 5.365 5.365 0 0 1 1.103 3.17 5.378 5.378 0 0 1-1.105 3.176 1.5 1.5 0 1 0 2.395 1.806 8.396 8.396 0 0 0 1.71-4.981 8.39 8.39 0 0 0-1.708-4.978Zm3.73-2.332A1.5 1.5 0 1 0 18.04 6.59 8.823 8.823 0 0 1 20 12.007a8.798 8.798 0 0 1-1.96 5.415 1.5 1.5 0 0 0 2.326 1.894 11.672 11.672 0 0 0 2.635-7.31 11.682 11.682 0 0 0-2.635-7.31Zm-8.963-3.613a1.001 1.001 0 0 0-1.082.187L5.265 6H2a1 1 0 0 0-1 1v10.003a1 1 0 0 0 1 1h3.265l5.01 4.682.02.021a1 1 0 0 0 1.704-.814L12.005 2a1 1 0 0 0-.602-.917Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Audo is muted."
                        className="x1lliihq x1n2onr6 x9bdzbf"
                        fill="currentColor"
                        height="12"
                        role="img"
                        viewBox="0 0 48 48"
                        width="12"
                      >
                        <title>Audo is muted.</title>
                        <path
                          clipRule="evenodd"
                          d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z"
                          fillRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="post-footer">
          <div className="post-intractions">
            <div className="left-post-intractions">
              <div onClick={handlePostLike}>
                {postLike ? (
                  <svg
                    aria-label="Unlike"
                    className="x1lliihq x1n2onr6 xxk16z8"
                    fill="#ff3040"
                    height="24"
                    role="img"
                    viewBox="0 0 48 48"
                    width="24"
                  >
                    <title>Unlike</title>
                    <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Like"
                    className="x1lliihq x1n2onr6 xyb1xck svgHover"
                    fill="currentColor"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <title>Like</title>
                    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z" />
                  </svg>
                )}
              </div>

              <svg onClick={handleViewComment}
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Comment"
                className="x1lliihq x1n2onr6 x5n08af svgHover"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Comment</title>
                <path
                  d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>

              <svg
                onClick={() => setSendPostDailog(priVal => !priVal)}
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Share Post"
                className="x1lliihq x1n2onr6 x1roi4f4 svgHover"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Share Post</title>
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  x1="22"
                  x2="9.218"
                  y1="3"
                  y2="10.083"
                />
                <polygon
                  fill="none"
                  points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="right-post-intraction" onClick={handlePostSave}>
              {postSave ? (
                <svg
                  aria-label="Remove"
                  className="x1lliihq x1n2onr6 x5n08af"
                  fill="currentColor"
                  height={24}
                  role="img"
                  viewBox="0 0 24 24"
                  width={24}
                >
                  <title>Remove</title>
                  <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Save"
                  className="x1lliihq x1n2onr6 x5n08af svgHover"
                  fill="currentColor"
                  height="24"
                  role="img"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <title>Save</title>
                  <polygon
                    fill="none"
                    points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </div>
          </div>

          {postLikedUsers.length > 0 && (
            <div className="post-liked-profiles">
              <div className="liked-profiles">
                {postLikedUsers.map((elem, i) => {
                  return (
                    <div className="profile-img-layout" key={i}>
                      <img src={elem.userProfileImg} alt={elem.userName} />
                    </div>
                  );
                })}
              </div>
              <span className="post-liked-by">
                {" "}
                Liked by{" "}
                <span className="post-liked-user-name">
                  {postLikedUsers[0]?.userName}
                </span>{" "}
                and{" "}
                <Link to="">
                  {" "}
                  <span className="post-liked-others">others</span>{" "}
                </Link>
              </span>
            </div>
          )}

          <span
            className={
              showMoreTitle && postData.postTitle.length > 130
                ? "post-title-area active"
                : "post-title-area"
            }
          >
            <Link to={`/${postUser.userName}/`}>
              <span className="post-user-username">{postUser?.userName}</span>
            </Link>{" "}
            <span className="post-title">{postData.postTitle}</span>
            {!showMoreTitle && postData.postTitle.length > 130 && (
              <button
                onClick={() => setShowMoreTitle((priVal) => !priVal)}
                className="remove-hided-title-btn"
              >
                more
              </button>
            )}{" "}
          </span>

          <div className="view-all-comment-section">
            <span className="view-all-commends-txt-btn">
              View all 15 comments
            </span>
          </div>

          <div className="add-comment-section">
            <input
              placeholder="Add a comment..."
              type="text"
              className="comment-input"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />

            <button
              className={
                comment != "" ? "comment-post-btn active" : "comment-post-btn"
              }
              onClick={handleCommentPost}
            >
              Post
            </button>

            <div className="comment-emoji-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Emoji"
                className="x1lliihq x1n2onr6 x1roi4f4"
                fill="currentColor"
                height="13"
                role="img"
                viewBox="0 0 24 24"
                width="13"
              >
                <title>Emoji</title>
                <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="end-post-horizontal-row"></div>
      </div>
    </div>
  );
};

export default Post;
