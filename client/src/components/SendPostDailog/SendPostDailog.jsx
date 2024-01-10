import React, { useContext, useEffect, useState } from "react";
import ActionButton from "../ActionButton/ActionButton";
import "./SendPostDailog.css";
import { searchUsers } from "../../action/curUser";
import { AppContext } from "../../Context/context";

const SendpostDailogCards = ({ cardUsers, setSelectedUsers }) => {
  const [isCardSelected, setIsCardSelected] = useState(false);

  const handleCardClick = () => {
    if (isCardSelected) {
      setSelectedUsers((priVal) =>
        priVal.filter((elem) => elem !== cardUsers.userId)
      );
    } else {
      setSelectedUsers((priVal) => [...priVal, cardUsers.userId]);
    }

    setIsCardSelected((priVal) => !priVal);
  };

  return (
    <div className="send-post-dailog-card-user-card" onClick={handleCardClick}>
      <div className="send-post-card-dailog-card-containt">
        <div className="send-post-card-img-layout">
          <div className="send-post-card-img">
            <img src={cardUsers.userProfileImg} alt="" />
          </div>
        </div>
        <div className="send-post-card-user-meta">
          <span className="send-post-card-user-Name">{cardUsers.fullName}</span>
          <span className="send-post-card-user-userName">
            {cardUsers.userName}
          </span>
        </div>
        <div className="send-post-card-user-Check-box-layout">
          <div
            className={
              isCardSelected
                ? "send-post-card-user-check-box active"
                : "send-post-card-user-check-box"
            }
          >
            <svg
              aria-label=""
              className="x1lliihq x1n2onr6 x1ttxmnt"
              fill="currentColor"
              height={14}
              role="img"
              viewBox="0 0 24 24"
              width={14}
            >
              <title />
              <polyline
                fill="none"
                points="21.648 5.352 9.002 17.998 2.358 11.358"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const SendPostDailog = () => {

  const {setSendPostDailog} = useContext(AppContext);

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMeassage] = useState("");
  const [searchUserQuery, setSearchUserQuery] = useState("");

  const handleSearchUserOnChange = async (e) => {
    setSearchUserQuery(e.target.value);

    if (e.target.value == "") {
      setSearchedUsers([]);
    } else {
      const response = await searchUsers({ searchUser: e.target.value });
      setSearchedUsers(response?.result);
    }
  };

  const handleSendPostBtn = () => {
    console.log(selectedUsers);
    console.log(message);
  };

  return (
    <div className="send-post-dailog">
      <div className="send-post-dailog-content">
        <div
          className={
            selectedUsers.length > 0
              ? "send-post-dailog-card active"
              : "send-post-dailog-card"
          }
        >
          <div className="send-post-dailog-header">
            <div className="send-post-dailog-header-title">
              <h1>Share</h1>
            </div>
            <div className="send-post-dailog-header-close-btn" onClick={()=>setSendPostDailog(priVal => !priVal)}>
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
          </div>
          <div className="send-post-dailog-search-section">
            <div className="send-post-dailog-search-content">
              <span className="send-post-dailog-search-heading">To:</span>
              <input
                onChange={(e) => handleSearchUserOnChange(e)}
                value={searchUserQuery}
                type="text"
                placeholder="Search..."
                className="send-post-dailog-search-input"
              />
            </div>
          </div>
          <div className="send-post-dailog-search-result">
            <div className="send-post-dailog-search-result-content">
              {searchedUsers?.map((elem) => {
                return (
                  <SendpostDailogCards
                    onClick={() => alert("hello")}
                    key={elem.userId}
                    cardUsers={elem}
                    setSelectedUsers={setSelectedUsers}
                  />
                );
              })}
            </div>
          </div>
          <div className="send-post-dailog-send-btn">
            <div className="send-post-btn-message-section">
              <input
                onChange={(e) => {
                  setMeassage(e.target.value);
                }}
                value={message}
                type="text"
                placeholder="Write a message..."
              />
            </div>
            <ActionButton
              title={"Send"}
              isUrlBtn={false}
              color="#0095f6"
              onclick={handleSendPostBtn}
            />
            <div className={selectedUsers.length === 0 ? "send-btn-overlay active" : "send-btn-overlay"}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendPostDailog;
