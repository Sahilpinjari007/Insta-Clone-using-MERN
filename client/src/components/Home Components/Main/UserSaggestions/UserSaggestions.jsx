import React, { useContext } from "react";
import "./UserSaggestions.css";
import SaggestedUserAc from "./SaggestedUserAc/SaggestedUserAc";
import { Link } from "react-router-dom";
import { AppContext } from "../../../../Context/context";

const UserSaggestions = () => {
  const { authUser } = useContext(AppContext);

  return (
    <div className="user-saggestion-section">
      <div className="user-saggestions">
        <div className="current-user">
          <div className="currentUserAc">
            <div className="currentUserAc-content">
              <div
                className={
                  authUser.isHaveStory === 'true'
                    ? "currentUserAc-img-layout active"
                    : "currentUserAc-img-layout"
                }
              >
                <div className="currentUserAc-img">
                  <img src={authUser.userProfileImg} alt="img not found" />
                </div>
              </div>

              <div className="currentUserAc-info">
                <span className="currentUserAc-username">
                  {authUser.userName}
                </span>
                <span className="currentUserAc-name">{authUser.fullName}</span>
              </div>
              <button className="currentUserAc-switch-ac-btn">Switch</button>
            </div>
          </div>
        </div>

        <div className="show-all-saggestions-bar">
          <span className="saggestions-bar-heading">Suggested for you</span>
          <Link to>
            <button className="see-all-saggestion-btn">See All</button>
          </Link>
        </div>

        <div className="specific-saggestions">
          <SaggestedUserAc />
          <SaggestedUserAc />
          <SaggestedUserAc />
          <SaggestedUserAc />
          <SaggestedUserAc />
          <SaggestedUserAc />
        </div>

        <div className="user-saggestion-footer">
          <ul>
            <li>About</li>
            <li>.</li>
            <li>Help</li>
            <li>.</li>
            <li>Press</li>
            <li>.</li>
            <li>Press</li>
            <li>.</li>
            <li>API</li>
            <li>.</li>
            <li>Jobs</li>
            <li>.</li>
            <li>Privacy</li>
            <li>.</li>
            <li>Terms</li>
            <li>.</li>
            <li>Location</li>
            <li>.</li>
            <li>Language</li>
            <li>.</li>
            <li>Meta Verfied</li>
          </ul>
          <span className="inst-copy-right">
            &#169; 2023 INSTAGRAM FROM META
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserSaggestions;
