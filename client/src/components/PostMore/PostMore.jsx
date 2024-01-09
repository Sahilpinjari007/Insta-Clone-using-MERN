import React, { useContext, useEffect, useState } from "react";
import "./PostMore.css";
import { AppContext } from "../../Context/context";
import { checkUserFollowed } from "../../action/curUser";

const PostMore = ({ setShowRemoveFollowDailog }) => {
  const { setIsActivePostMore, authUser, currentPostUserId } =
    useContext(AppContext);
  const [isUserFollowed, setIsUserFollowed] = useState(false);

  const unFollowCurrentUser = async () => {
    setIsActivePostMore(false);
    setShowRemoveFollowDailog(true);
  };

  const checkUserFollwed = async () => {
    const response = await checkUserFollowed({
      followerUserId: currentPostUserId,
      followingUserId: authUser.userId,
    });

    setIsUserFollowed(response.value);
  };

  useEffect(() => {
    checkUserFollwed();
  }, [currentPostUserId]);

  return (
    <div className="post-more-alert">
      <div className="post-more-alert-content">
        <div className="post-more-alert-popup">
          <button type="button">Report</button>
          <button disabled={!isUserFollowed} type="button" onClick={unFollowCurrentUser}>
            UnFollow
            <div className={!isUserFollowed ? "disibled-button active" : "disibled-button"}></div>
          </button>
          <button type="button" onClick={() => setIsActivePostMore(false)}>
            Cancle
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostMore;
