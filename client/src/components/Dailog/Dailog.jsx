import React, { useContext, useRef } from "react";
import "./Dailog.css";
import { AppContext } from "../../Context/context";
import { profileImgUpdate } from "../../api/Api";
import { uploadMedia } from "../../action/storage";



const Dailog = () => {


  const imgInput = useRef()
  const { setShowProfileDailog, authUser, getCurrentUser, setIsAlert, setAleartData } = useContext(AppContext);

  const handleUploadImgBtn = () => {
    imgInput.current.click();
  }

  const handleImgInputChnge = (e) => {
    setShowProfileDailog(false);
    uploadImgToServer(e.target.files[0]);
  }

  const uploadImgToServer = async (media) => {

    const response = await uploadMedia(media);
    const result = await response.json();

    if (result.code === 200) {
      const { data } = await profileImgUpdate({ userId: authUser.userId, profileImgUrl: result.url });

      if (data.code == 200) {
        setIsAlert(true);
        setAleartData({ message: 'Profile Image uploaded successfull!', type: 'Success' })
        getCurrentUser(authUser.userId)
      }
    }
  }



  return (
    <div className="insta-dailog-from-profile">
      <div className="dailog-content">
        <div className="dailog-header">
          <div className="profile-img">
            <img
              draggable={false}
              src={authUser.userProfileImg}
              alt="profile pic"
            />
          </div>
          <h1 className="dailog-heading">Synced profile photo</h1>
          <span className="dailog-sub-heading">Instagram, Facebook</span>
        </div>
        <div className="dailog-btns">
          <button className="dailog-btn" onClick={handleUploadImgBtn}>Upload Photo</button>
          <button className="dailog-btn">Manage sync setting</button>
          <button className="dailog-btn">Remove Current Photo</button>
          <button className="dailog-btn" onClick={() => setShowProfileDailog(false)} >Cancle</button>
        </div>
        <input onChange={(e) => handleImgInputChnge(e)} ref={imgInput} type="file" accept="image/png, image/gif, image/jpeg" id="img-input" />
      </div>
    </div>
  );
};

export default Dailog;
