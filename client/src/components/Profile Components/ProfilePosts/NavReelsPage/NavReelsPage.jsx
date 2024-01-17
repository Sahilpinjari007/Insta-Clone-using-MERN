import React, { useContext, useEffect, useState } from "react";
import "./NavReelsPage.css";
import { AppContext } from "../../../../Context/context";
import { getUserReels } from "../../../../action/post";

const NavReelPageCard = ({ cardData }) => {

  const { setViewUserMedia, setViewUserMediaData } = useContext(AppContext);

  const handlePostOnClick = () => {
    setViewUserMediaData(cardData);
    setViewUserMedia(true);
  }

  return (
    <div className="nav-reel-page-card" onClick={handlePostOnClick}>
      <div className="reel-page-card-content">
        <video src={cardData.postVideoURL}></video>
      </div>
      <div className="reel-page-card-meta">
        <div className="play-icon">
          <svg
            aria-label="Play count icon"
            className="x1lliihq x1n2onr6 x9bdzbf"
            fill="currentColor"
            height={16}
            role="img"
            viewBox="0 0 24 24"
            width={16}
          >
            <title>Play count icon</title>
            <path d="M5.888 22.5a3.46 3.46 0 0 1-1.721-.46l-.003-.002a3.451 3.451 0 0 1-1.72-2.982V4.943a3.445 3.445 0 0 1 5.163-2.987l12.226 7.059a3.444 3.444 0 0 1-.001 5.967l-12.22 7.056a3.462 3.462 0 0 1-1.724.462Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const NavReelsPage = () => {
  const { profileUser } = useContext(AppContext);
  const [userReels, setUserReels] = useState([]);

  const getUserAllReels = async () => {
    const newArr = [];
    const response = await getUserReels(profileUser.userId);

    while (response.result.length > 0) {
      newArr.push(response.result.splice(0, 4));
    }

    setUserReels(newArr)
  };

  useEffect(() => {
    getUserAllReels();
  }, [profileUser]);

  return (
    <div className="nav-reel-page">
      {userReels?.map((elem, i) => {
        return <div key={i} className="nav-reel-page-row">{elem?.map((item, i) => <NavReelPageCard cardData={item} key={i}/>)}</div>;
      })}
    </div>
  );
};

export default NavReelsPage;
