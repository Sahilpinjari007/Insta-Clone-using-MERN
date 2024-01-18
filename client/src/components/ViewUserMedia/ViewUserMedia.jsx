import React, { useContext, useEffect, useRef, useState } from "react";
import "./ViewUserMedia.css";
import { AppContext } from "../../Context/context";
import { checkUserFollowed, followUser, getUser } from "../../action/curUser";
import {
  checkPostLiked,
  checkPostSaved,
  commentOnPost,
  deleteUserComment,
  getPostComments,
  likePost,
  savePost,
} from "../../action/post";
import moment from "moment";
import DeleteCommentAlert from "../DeleteCommentAlert/DeleteCommentAlert";

const PostComment = ({
  commentData,
  setShowDeleteCommentDailog,
  setDeleteCommentId,
}) => {
  const [commentUser, setCommentUser] = useState({});
  const { authUser } = useContext(AppContext);

  const getCommentUser = async () => {
    const response = await getUser(commentData.commentedUserId);
    setCommentUser(response.result);
  };

  useEffect(() => {
    getCommentUser();
  }, [commentData]);

  return (
    <div className="comment">
      <div className="comment-content">
        <div className="comment-user-profile-img-layout">
          <div
            className={
              commentUser.isHaveStory
                ? "comment-user-profile-img active"
                : "comment-user-profile-img"
            }
          >
            <img src={commentUser.userProfileImg} alt={commentUser.userName} />
          </div>
        </div>

        <div className="comment-meta">
          <div className="comment-user-name">
            <span>{commentUser.userName}</span>
            {authUser.userId === commentData.commentedUserId && (
              <div
                className="comment-more-icon"
                onClick={() => {
                  setShowDeleteCommentDailog(true);
                  setDeleteCommentId(commentData.commentId);
                }}
              >
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
            )}
          </div>
          <div className="comment-txt">
            <span>{commentData.message}</span>
          </div>
        </div>

        <div className="comment-time">
          <span>{moment().from(commentData.timeStamp)}</span>
        </div>
      </div>
    </div>
  );
};

const ViewUserMedia = () => {
  const {
    setViewUserMedia,
    viewUserMediaData,
    authUser,
    setAleartData,
    setIsAlert,
    setSendPostDailog,
    setCurrentPostUserId,
    setIsActivePostMore,
  } = useContext(AppContext);

  const [postUser, setPostUser] = useState({});
  const [isUserFollowed, setIsUserFollowed] = useState(true);

  const videoMedia = useRef(null);
  const commentInput = useRef(null);
  const audioElement = useRef(null);

  const [multiplePosts, setMultiplePosts] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [isActivePostBtn, setIsActivePostBtn] = useState(false);
  const [showRightScrollBtn, setShowRightScrollBtn] = useState(true);
  const [showLeftScrollBtn, setShowLeftScrollBtn] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [isPostSaved, setIsPostSaved] = useState(false);

  const [videoSituation, setVideoSituation] = useState(false);
  const [isSongPlay, setIsSongPlay] = useState(false);

  const [showDeleteCommentDailog, setShowDeleteCommentDailog] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState("");

  const hanldeRightPostScroll = () => {
    if (currentImgIndex !== multiplePosts.length - 1) {
      setCurrentImgIndex(currentImgIndex + 1);
    }
  };

  const handleLeftPostScroll = () => {
    if (currentImgIndex !== 0) {
      setCurrentImgIndex(currentImgIndex - 1);
    }
  };

  const handlePostLike = async () => {
    const response = await likePost({
      postId: viewUserMediaData.postId,
      likedUserId: authUser.userId,
      postUserId: viewUserMediaData.postUserUserId,
      postLikes: viewUserMediaData.postLikes,
    });

    if (response.code === 200) {
      setIsPostLiked(response?.value);
    } else {
      setIsAlert(true);
      setAleartData({ message: "Unable to Like Post!", type: "Error" });
    }
  };

  const handlePostSaved = async () => {
    const response = await savePost({
      postId: viewUserMediaData.postId,
      userId: authUser.userId,
    });

    if (response.code === 200) {
      setIsPostSaved(response?.value);
    } else {
      setIsAlert(true);
      setAleartData({ message: "Unable to Save Post!", type: "Error" });
    }
  };

  const handleComment = () => {
    commentInput.current.focus();
  };

  const handleCommentOnChange = (e) => {
    setComment(e.target.value);

    if (e.target.value === "") setIsActivePostBtn(false);
    else setIsActivePostBtn(true);
  };

  const handlePostComment = async (e) => {
    if (comment !== "" && isActivePostBtn) {
      const response = await commentOnPost({
        postId: viewUserMediaData.postId,
        postUserId: viewUserMediaData.postUserUserId,
        commentedUserId: authUser.userId,
        message: comment,
        timeStamp: new Date(),
      });

      if (response.code !== 200) {
        setIsAlert(true);
        setAleartData({ message: "Unable to Post Comment!", type: "Error" });
      }

      setComment("");
      getComments();
    }
  };

  const handleVideoSituation = () => {
    if (videoSituation) {
      setVideoSituation(false);
      videoMedia.current.pause();
    } else {
      setVideoSituation(true);
      videoMedia.current.play();
    }
  };

  const handleSongSituation = () => {
    if (viewUserMediaData.isPostContainSong === 'true') {
      if (isSongPlay) {
        setIsSongPlay(false);
        audioElement.current.pause();
      } else {
        setIsSongPlay(true);
        audioElement.current.play();
      }
    } else {
      if (viewUserMediaData.postType === "video") {
        if (isSongPlay) {
          setIsSongPlay(false);
          videoMedia.current.muted = true;
        } else {
          setIsSongPlay(true);
          videoMedia.current.muted = false;
        }
      }
    }
  };

  const getPostUser = async () => {
    const response = await getUser(viewUserMediaData.postUserUserId);
    setPostUser(response.result);
  };

  const FollowUser = async () => {
    const response = await followUser({
      followerUserId: postUser.userId,
      followingUserId: authUser.userId,
      timeStamp: new Date(),
      followerUserFollowerCount: postUser.Followers,
      followingUserFollwingCount: authUser.Following,
    });

    if (response.code !== 200) {
      setIsAlert(true);
      setAleartData({ message: "Unable to Follow User", type: "Error" });
    } else {
      setIsUserFollowed(true);
    }
  };

  const checkUserFollowedOrNot = async () => {
    if (viewUserMediaData.postUserUserId === authUser.userId) return;

    const response = await checkUserFollowed({
      followerUserId: viewUserMediaData.postUserUserId,
      followingUserId: authUser.userId,
    });

    if (response.code === 200) setIsUserFollowed(response.value);
  };

  const checkPostLikedOrNot = async () => {
    const response = await checkPostLiked({
      postId: viewUserMediaData.postId,
      likedUserId: authUser.userId,
      postUserId: viewUserMediaData.postUserUserId,
    });
    setIsPostLiked(response.value);
  };

  const checkPostSavedOrNot = async () => {
    const response = await checkPostSaved({
      postId: viewUserMediaData.postId,
      userId: authUser.userId,
    });

    if (response.code === 200) {
      setIsPostSaved(response?.value);
    }
  };

  const getComments = async () => {
    const response = await getPostComments(viewUserMediaData.postId);
    if (response.code === 200) setPostComments(response.result);
  };

  const deleteComment = async () => {
    const response = await deleteUserComment(deleteCommentId);

    if (response.code !== 200) {
      setIsAlert(true);
      setAleartData({ message: "Unable to Delete Comment!", type: "Error" });
    }

    setShowDeleteCommentDailog(false);
    getComments();
  };


  useEffect(() => {
    getComments();

    if (currentImgIndex === 0) {
      setShowLeftScrollBtn(false);
      setShowRightScrollBtn(true);
    } else if (currentImgIndex === multiplePosts.length - 1) {
      setShowRightScrollBtn(false);
      setShowLeftScrollBtn(true);
    } else if (currentImgIndex >= 1) {
      setShowLeftScrollBtn(true);
      setShowRightScrollBtn(true);
    }

    if (videoMedia.current) {
      videoMedia.current.play();
      setVideoSituation(true);
    }

    if (viewUserMediaData.isMultiplePost) {
      setMultiplePosts(viewUserMediaData.multipleImgPostURLS);
    }

    getPostUser();
    checkUserFollowedOrNot();
    checkPostLikedOrNot();
    checkPostSavedOrNot();
  }, [currentImgIndex, viewUserMediaData]);

  return (
    <>
      <div className="viewUserMedia-section">
        <div className="viewUserMedia-section-content">
        <audio ref={audioElement} src={viewUserMediaData.postSongURL}></audio>
          <div
            className="close-viewUserMedia-dailog-btn"
            onClick={() => setViewUserMedia(false)}
          >
            <svg
              aria-label="Close"
              className="x1lliihq x1n2onr6 x5n08af"
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
          <div className="viewUserMedia-dailog">
            <article className="viewUserMedia-dailog-content">
              <div className="viewUserMedia-articale-content">
                <div className="viewUserMedia-media-section">
                  <div className="viewUserMedia-media-section-content">
                    {viewUserMediaData.postType === "img" ? (
                      <div className="img-media-content">
                        <div className="viewUserMedia-img-layout">
                          <img
                            draggable={false}
                            src={
                              viewUserMediaData.isMultiplePost === "true"
                                ? multiplePosts[currentImgIndex]?.url
                                : viewUserMediaData.singlePostImgURL
                            }
                            alt=""
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="video-media-content">
                        <div
                          className={
                            videoSituation
                              ? "video-media-push-btn"
                              : "video-media-push-btn active"
                          }
                        ></div>
                        <video
                          muted
                          onPause={() => setVideoSituation(false)}
                          onClick={handleVideoSituation}
                          ref={videoMedia}
                          src={viewUserMediaData.postVideoURL}
                        ></video>
                      </div>
                    )}

                    <div className="viewUserMedia-media-section-footer">
                      <div className="viewUserMedia-media-section-footer-content">
                        {viewUserMediaData.isPostTaged === "true" && (
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

                        {viewUserMediaData.isMultiplePost === "true" && (
                          <div className="current-post-active-thumbs">
                            {multiplePosts?.map((elem, i) => {
                              return (
                                <div
                                  key={i}
                                  className={
                                    currentImgIndex === i
                                      ? "current-post-thumb active"
                                      : "current-post-thumb"
                                  }
                                ></div>
                              );
                            })}
                          </div>
                        )}

                        {(viewUserMediaData.postType === "video" ||
                          viewUserMediaData.isPostContainSong === "true") && (
                          <div
                            className="audio-icon"
                            onClick={handleSongSituation}
                          >
                            {isSongPlay ? (
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

                    {viewUserMediaData.isMultiplePost === "true" && (
                      <>
                        <div
                          className={
                            showLeftScrollBtn
                              ? "viewUserMedia-left-scroll-btn active"
                              : "viewUserMedia-left-scroll-btn"
                          }
                          onClick={handleLeftPostScroll}
                        ></div>

                        <div
                          className={
                            showRightScrollBtn
                              ? "viewUserMedia-right-scroll-btn active"
                              : "viewUserMedia-right-scroll-btn"
                          }
                          onClick={hanldeRightPostScroll}
                        ></div>
                      </>
                    )}
                  </div>
                </div>

                <div className="viewUserMedia-media-meta-data-section">
                  <header className="viewUserMedia-meta-header">
                    <div className="viewUserMedia-meta-header-content">
                      <div className="viewUserMedia-meta-profile-img-layout">
                        <div
                          className={
                            postUser?.isHaveStory === "true"
                              ? "viewUserMedia-meta-profile-img active"
                              : "viewUserMedia-meta-profile-img"
                          }
                        >
                          <img
                            src={postUser?.userProfileImg}
                            alt={postUser?.userName}
                          />
                        </div>
                      </div>

                      <div className="viewUserMedia-meta-username">
                        <span>{postUser?.userName}</span>
                      </div>
                      {!isUserFollowed && (
                        <>
                          <div className="viewUserMedia-meta-sapretor"></div>
                          <span
                            onClick={FollowUser}
                            className="viewUserMedia-meta-follow-btn"
                          >
                            Follow
                          </span>
                        </>
                      )}
                      <div
                        className="viewUserMedia-meta-more-action-btn"
                        onClick={() => {
                          setIsActivePostMore(true);
                          setCurrentPostUserId(postUser.userId);
                          setViewUserMedia(false);
                        }}
                      >
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
                  </header>
                  <section className="viewUserMedia-meta-comment-section">
                    <div className="viewUserMedia-meta-comment-section-content">
                      {postComments?.map((elem, i) => {
                        return (
                          <PostComment
                            key={i}
                            commentData={elem}
                            setShowDeleteCommentDailog={
                              setShowDeleteCommentDailog
                            }
                            setDeleteCommentId={setDeleteCommentId}
                          />
                        );
                      })}
                    </div>
                    {postComments.length === 0 && (
                      <div className="no-comment-alert">
                        <h1 className="no-comment-alert-heading">
                          No comments yet.
                        </h1>
                        <h3 className="no-comment-alert-sub-heading">
                          Start the conversation.
                        </h3>
                      </div>
                    )}
                  </section>
                  <div className="viewUserMedia-meta-post-intractions">
                    <div className="viewUserMedia-meta-post-intraction-content">
                      <div className="viewUserMedia-meta-right-post-intractions">
                        <div onClick={handlePostLike}>
                          {isPostLiked ? (
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

                        <div onClick={handleComment}>
                          <svg
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
                        </div>

                        <div
                          onClick={() => setSendPostDailog((priVal) => !priVal)}
                        >
                          <svg
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
                      </div>
                      <div className="viewUserMedia-meta-left-post-intractions">
                        <div onClick={handlePostSaved}>
                          {isPostSaved ? (
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
                    </div>
                    <div className="viewUserMedia-meta-post-timestapm">
                      <span>
                        {moment().from(viewUserMediaData.postTimeStamp)}
                      </span>
                    </div>
                  </div>
                  <div className="viewUserMedia-meta-add-comment-section">
                    <div className="viewUserMedia-meta-add-comment-content">
                      <div className="viewUserMedia-media-comment-emoji-btn">
                        <svg
                          aria-label="Emoji"
                          className="x1lliihq x1n2onr6 x5n08af"
                          fill="currentColor"
                          height={24}
                          role="img"
                          viewBox="0 0 24 24"
                          width={24}
                        >
                          <title>Emoji</title>
                          <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z" />
                        </svg>
                      </div>
                      <div className="viewUserMedia-media-comment-text-area">
                        <textarea
                          value={comment}
                          onChange={(e) => handleCommentOnChange(e)}
                          ref={commentInput}
                          placeholder="Add a comment..."
                        ></textarea>
                      </div>
                      <div
                        className={
                          isActivePostBtn
                            ? "viewUserMedia-media-comment-post-btn active"
                            : "viewUserMedia-media-comment-post-btn"
                        }
                      >
                        <span onClick={handlePostComment}>Post</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      {showDeleteCommentDailog && (
        <DeleteCommentAlert
          setShowDeleteCommentDailog={setShowDeleteCommentDailog}
          deleteComment={deleteComment}
        />
      )}
    </>
  );
};

export default ViewUserMedia;
