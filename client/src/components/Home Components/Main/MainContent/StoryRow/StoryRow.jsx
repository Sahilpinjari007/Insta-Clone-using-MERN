import React, { useContext, useEffect, useRef, useState } from "react";
import UserStory from "./UserStory/UserStory";
import "./StoryRow.css";
import { AppContext } from '../../../../../Context/context'

const StoryRow = () => {

  const { authUser } = useContext(AppContext);

  const StoryRow = document.querySelector(".sotry-row-content");

  const [showLeftScrollBtn, setShowLeftScrollBtn] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);

  useEffect(() => {

    if (scrollValue > 50) {
      setShowLeftScrollBtn(true);
    }
    else {
      setShowLeftScrollBtn(false);
    }
  }, [scrollValue]);

  const leftScrollBtnClick = () => {
    StoryRow.scrollTo(scrollValue - 300, 0);
    setScrollValue(scrollValue - 300)
  };

  const rightScrollBtnClick = () => {
    StoryRow.scrollTo(scrollValue + 300, 0);
    setScrollValue(scrollValue + 300)
  };

  return (
    <div className="story-row">
      {showLeftScrollBtn && (
        <div
          className="left-scroll-story-row-btn"
          onClick={leftScrollBtnClick}
        ></div>
      )}
      <div className="sotry-row-content">
        <div className="currentUserStory">
          <UserStory data={{ userName: 'Yout Story', img: authUser.userProfileImg }} />
        </div>

        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
        <UserStory />
      </div>
      <div
        className="right-scroll-story-row-btn"
        onClick={rightScrollBtnClick}
      ></div>
    </div>
  );
};

export default StoryRow;
