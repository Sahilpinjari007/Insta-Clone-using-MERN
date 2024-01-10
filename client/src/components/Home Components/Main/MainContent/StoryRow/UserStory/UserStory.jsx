import React from "react";
import "./UserStory.css";

const UserStory = ({
  data = {
    userName: "Sahil pinjari",
    img: "../../../../../../../public/insta imgs/asset 3.jpeg",
  },
}) => {
  return (
    <div className="userStory">
      <div className="story-content">
        <div className="user-story-img-layout">
          <div className="user-story-img">
            <img src={data.img} alt="img not found" />
          </div>
        </div>
        <span className="story-user-name">{data.userName}</span>
      </div>
    </div>
  );
};

export default UserStory;
