import React, { useContext, useRef } from "react";
import "./Dailog.css";
import { AppContext } from "../../Context/context";
import { storage } from "../../Firebase/firebase";
import { v4 } from 'uuid'
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { profileImgUpdate } from "../../api/Api";



const Dailog = () => {


  const imgInput = useRef()
  const { setShowProfileDailog, authUser, getCurrentUser } = useContext(AppContext);

  const handleUploadImgBtn = () => {
    imgInput.current.click();
  }

  const handleImgInputChnge = (e) => {
    setShowProfileDailog(false);
    uploadImgToServer(e.target.files[0]);
  }

  const uploadImgToServer = async (imageUpload) => {
    if (imageUpload == null) return;

    const storageRef = ref(storage, `images/profileImage/${imageUpload.name + v4()}`);
    const uploadTask = uploadBytesResumable(storageRef, imageUpload);

    uploadTask.on('state_changed', (snapshot) => {
    }, (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {

          const { data } = await profileImgUpdate({ userId: authUser.userId, profileImgUrl: url });

          if (data.code == 200) {
            alert('Profile Image uploaded successfull!');
            getCurrentUser(authUser.userId)
          }
        });
      })
  }


  return (
    <div className="insta-dailog-from-profile">
      <div className="dailog-content">
        <div className="dailog-header">
          <div className="profile-img">
            <img
              src="../../../../../../../public/insta imgs/asset 2.jpeg"
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
