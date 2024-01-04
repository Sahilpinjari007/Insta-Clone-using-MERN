import React, { useContext, useEffect, useRef, useState } from "react";
import "./CheckFollowerDailog.css";
import UserCards from "../userCards/userCards";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/context";
import { getUserFollowers } from "../../action/curUser";
import RemoveFollowDailog from "../RemoveFollowDailog/RemoveFollowDailog";

const CheckFollowerDailog = () => {

  const searchBar = useRef();
  const navigate = useNavigate();
  
  const { profileUser, setLoading, fromDailog, setFromDailog } = useContext(AppContext);

  const [showSearchIcon, setShowSearchIcon] = useState(true);
  const [showSearchPlaceholder, setShowSearchPlaceholder] = useState(true);
  const [showClearQueryIcon, setShowClearQueryIcon] = useState(false);
  const [searhcQuery, setSearhcQuery] = useState("");
  const [followUsers, setFollowUsers] = useState([]);

  const [showRemoveFollowDailog, setShowRemoveFollowDailog] = useState(false);
  const [dailogData, setDailogData] = useState({});

  const hanldeOnChangeSearchInput = (e) => {
    if (e.target.value !== "") {
      setShowSearchIcon(false);
      setShowSearchPlaceholder(false);
      setShowClearQueryIcon(true);
    } else {
      setShowSearchPlaceholder(true);
      setShowClearQueryIcon(false);
    }

    setSearhcQuery(e.target.value);
  };

  const handleSearchAtributeClick = () => {
    searchBar.current.focus();
  };

  const handleClearSearchQuery = () => {
    setSearhcQuery("");
    setShowSearchIcon(true);
    setShowSearchPlaceholder(true);
    setShowClearQueryIcon(false);
  };

  const handleGoBackBtn = () => {
    setLoading(true);
    navigate('../');
  };

  const fetchUserFollowers = async () => {
    const response = await getUserFollowers({
      userId: profileUser.userId,
      userCount: 10
    });

    setFollowUsers([]);
    setFollowUsers(response.result);
  }

  useEffect(() => {
    setLoading(false);
    fetchUserFollowers();
    setFromDailog('follow');
  }, [profileUser, showRemoveFollowDailog])

  return (
    <>
      <div className="checkFollowerDailog">
        <div className="check-follow-dailog-content">
          <div className="dailog-header">
            <h1 className="dailog-heading">Followers</h1>
            <div className="dailog-cancle-btn">
              <button type="button" onClick={handleGoBackBtn}>
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
              </button>
            </div>
          </div>

          <div className="dailog-main-content">
            <div className="dailog-search-bar">
              <input
                ref={searchBar}
                onBlur={() => searhcQuery === "" && setShowSearchIcon(true)}
                onFocus={() => setShowSearchIcon(false)}
                value={searhcQuery}
                onChange={(e) => hanldeOnChangeSearchInput(e)}
                type="text"
              />
              <div
                onClick={handleSearchAtributeClick}
                className="input-attributes"
              >
                {showSearchIcon && (
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
                )}
                {showSearchPlaceholder && (
                  <span className="input-placeholder">Search</span>
                )}
              </div>

              {showClearQueryIcon && (
                <div
                  onClick={handleClearSearchQuery}
                  className="cancle-input-text-btn"
                ></div>
              )}
            </div>

            <div className="dailog-content">
              {
                followUsers?.map((elem, i) => {
                  return <UserCards from={fromDailog} setShowRemoveFollowDailog={setShowRemoveFollowDailog} setDailogData={setDailogData} key={i} data={elem} />
                })
              }
            </div>
          </div>
        </div>
      </div>

      {showRemoveFollowDailog && <RemoveFollowDailog from={fromDailog} data={dailogData} setShowRemoveFollowDailog={setShowRemoveFollowDailog} />}
    </>
  );
};

export default CheckFollowerDailog;
