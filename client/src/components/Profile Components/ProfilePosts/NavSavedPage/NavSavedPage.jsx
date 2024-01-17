import React, { useContext, useEffect, useState } from 'react';
import './NavSavedPage.css';
import { AppContext } from '../../../../Context/context';
import { getPost, getUserSavedPosts } from '../../../../action/post';


const NavPostPageCard = ({ cardData }) => {

  const { setViewUserMedia, setViewUserMediaData } = useContext(AppContext);

  const [post, setPost] = useState({});

  const getPostData = async () => {
    const response = await getPost(cardData.postId);
    response.result = {
      ...response.result,
      multipleImgPostURLS: JSON.parse(response.result.multipleImgPostURLS),
    };
    setPost(response.result);
  }

  const handlePostOnClick = () => {
    setViewUserMediaData(post);
    setViewUserMedia(true);
  }

  useEffect(() => { getPostData() }, [cardData]);

  return (
    <div className="nav-saved-post-page-card" onClick={handlePostOnClick}>
      {post?.postType !== "img" && (
        <div className="reel-icon">
          <svg
            aria-label="Clip"
            className="x1lliihq x1n2onr6 x9bdzbf"
            fill="currentColor"
            height={18}
            role="img"
            viewBox="0 0 24 24"
            width={18}
          >
            <title>Clip</title>
            <path
              d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z"
              fillRule="evenodd"
            />
          </svg>
        </div>
      )}
      <div className="card-contain">
        {post?.postType === "img" ? (
          <img
            src={
              post.isMultiplePost === "true"
                ? post?.multipleImgPostURLS[0].url
                : post?.singlePostImgURL
            }
            alt={post?.postTitle}
            className="card-img"
          />
        ) : (
          <video
            src={post?.postVideoURL}
            alt={post?.postTitle}
            className="card-img"
          />
        )}
      </div>
    </div>
  );
};

const NavSavedPage = () => {
  const { profileUser } = useContext(AppContext);
  const [userSavedPosts, setUserSavedPosts] = useState([]);

  const getUserSavedAllPosts = async () => {
    const newArr = [];
    const response = await getUserSavedPosts(profileUser.userId);

    while (response.result.length > 0) {
      newArr.push(response.result.splice(0, 3));
    }

    setUserSavedPosts(newArr)
  };

  useEffect(() => {
    getUserSavedAllPosts();
  }, [profileUser]);

  return (
    <div className="nav-saved-post-page">
      {userSavedPosts?.map((elem, i) => {
        return <div key={i} className="nav-saved-post-page-row">{elem?.map((item, i) => <NavPostPageCard cardData={item} key={i} />)}</div>;
      })}
    </div>
  );
}

export default NavSavedPage;
