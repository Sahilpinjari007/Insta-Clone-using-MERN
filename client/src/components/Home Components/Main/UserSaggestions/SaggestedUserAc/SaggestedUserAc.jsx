import React from "react";
import "./SaggestedUserAc.css";

const SaggestedUserAc = () => {
  return (
    <div className="saggestedUserAc">
      <div className="saggestedUserAc-content">
      
        <div className="saggestionUserAc-img-layout">
          <div className="saggestedUserAc-img">
            <img
              src="../../../../../../../public/insta imgs/asset 3.jpeg"
              alt="img not found"
            />
          </div>
        </div>

        <div className="saggestedUserAc-info">
          <span className="saggestedUserAc-username">mr_fardeen009</span>
          <span className="saggestedUserAc-followed-by">
            Followed by saad_devil322 + 3 others
          </span>
        </div>
        <button className="saggestedUserAc-follow-btn">Follow</button>
      </div>
    </div>
  );
};

export default SaggestedUserAc;
