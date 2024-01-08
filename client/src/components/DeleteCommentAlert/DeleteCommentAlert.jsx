import React from "react";
import "./DeleteCommentAlert.css";

const DeleteCommentAlert = ({setShowDeleteCommentDailog}) => {
  return (
    <div className="delete-comment-alert">
      <div className="delete-comment-alert-content">
        <div className="delete-comment-alert-popup">
          <button type="button">Report</button>
          <button type="button">Delete</button>
          <button type="button" onClick={()=>setShowDeleteCommentDailog(false)}>Cancle</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCommentAlert;
