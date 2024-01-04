import React, { useEffect, useRef, useState } from "react";
import "./newUser.css";
import AuthFooter from "../../components/AuthFooter/AuthFooter";
import LogIn from "../../components/Login/LogIn";
import SignUp from "../../components/SignfUp/SignUp";

const NewUser = () => {
  let [currentImg, setCurrentImg] = useState({
    img1: "active",
    img2: "",
    img3: "",
    img4: "",
  });

  const [currentIndex, setCurrentIndex] = useState(2);

  useEffect(() => {
    setTimeout(() => {
      setCurrentImg({
        img1: "",
        img2: "",
        img3: "",
        img4: "",
        [`img${currentIndex}`]: "active",
      });
      setCurrentIndex(currentIndex + 1);

      if (currentIndex == 4) setCurrentIndex(1);
    }, 3000);
  }, [currentImg, currentIndex]);

  return (
    <>
      <div className="new-user-section">
        <div className="new-user-content">
          <div className="left-svg-section">
            <div className="svg-layout">
              <div className="svg-transition-imgs">
                <div className="transition-cover">
                  <img
                    className={`svg-transition-img ${currentImg.img1}`}
                    src="./assets/asset 2.png"
                    alt="Instagram"
                  />
                  <img
                    className={`svg-transition-img ${currentImg.img2}`}
                    src="./assets/asset 3.png"
                    alt="Instagram"
                  />
                  <img
                    className={`svg-transition-img ${currentImg.img3}`}
                    src="./assets/asset 4.png"
                    alt="Instagram"
                  />
                  <img
                    className={`svg-transition-img ${currentImg.img4}`}
                    src="./assets/asset 5.png"
                    alt="Instagram"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="right-intraction-section">
            {
              localStorage.getItem('isNotnewUser') ? <LogIn /> : <SignUp />
            }
          </div>
        </div>
      </div>

      <AuthFooter />
    </>
  );
};

export default NewUser;
