import React, { useContext } from "react";
import "./AleartMessage.css";
import { AppContext } from "../../Context/context";

const AleartMessage = () => {
  const { isAlert, aleartData } = useContext(AppContext);

  return (
    <div className={isAlert ? "aleart-message active" : "aleart-message"}>
      <div className="aleart-message-content">
        <span className="aleart-message-txt">
          <span className={`message-type ${aleartData.type}`}>
            {aleartData.type}:
          </span>{" "}
          {aleartData.message}
        </span>
      </div>
    </div>
  );
};

export default AleartMessage;
