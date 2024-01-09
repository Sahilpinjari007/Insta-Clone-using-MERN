import React, { useContext, useEffect, useRef, useState } from "react";
import "./MainProfileEdit.css";
import ActionButton from "../../../components/ActionButton/ActionButton";
import AuthFooter from "../../../components/AuthFooter/AuthFooter";
import { AppContext } from "../../../Context/context";
import { updateProfile } from "../../../action/curUser";

const MainProfileEdit = () => {
  const { setShowProfileDailog, authUser } = useContext(AppContext);

  const [isGenderListActive, setIsGenderListActive] = useState(false);
  const [gender, setGender] = useState("");
  const [customGenderValue, setCustomGenderValue] = useState("");
  const [userBio, setUserBio] = useState(null);
  const [userBioLength, setUserBioLength] = useState(0);

  const customGender = useRef();
  const genderCard = useRef();

  const selectorItemClick = (index, e) => {
    const allItemsCheckBox = Array.from(
      document.querySelectorAll(".selector-check-box")
    );

    allItemsCheckBox.forEach((elem) => {
      elem.classList.remove("active");
    });

    allItemsCheckBox[index].classList.toggle("active");

    if (e.target.innerText === "Custom") {
      setGender("");
      customGender.current.focus();
      customGender.current.classList.add("active");
      genderCard.current.classList.add("active");
    } else {
      setGender(e.target.innerText);
      setIsGenderListActive(false);
      customGender.current.classList.remove("active");
      genderCard.current.classList.remove("active");
    }
    setCustomGenderValue("");
  };

  const handleCustomGenderOnChange = (e) => {
    setCustomGenderValue(e.target.value);
    setGender(e.target.value);

    if (e.target.value === "") {
      customGender.current.classList.add("active");
      genderCard.current.classList.add("active");
    } else {
      customGender.current.classList.remove("active");
      genderCard.current.classList.remove("active");
    }
  };

  const handleChancePhoto = () => {
    setShowProfileDailog(true);
  };

  const handleBioOnChange = (e) => {
    setUserBioLength(e.target.value.length);
    setUserBio(e.target.value);
  };

  const handleFormSubmit = async () => {
    const data = {
      gender: gender || authUser.userGender,
      userBio: userBio || authUser.userBio,
      userId: authUser.userId,
    };

    const response = await updateProfile(data);

    console.log(response);
    // alert(response.message);
  };

  return (
    <>
      <div className="main-profile-editor">
        <div className="profile-editor-content">
          <div className="editor-form">
            <form action="">
              <h1 className="section-heading">Edit profile</h1>
              <div className="current-user-card">
                <div className="user-details">
                  <div className="user-profile-pic-layout">
                    <img
                      draggable={false}
                      src={authUser.userProfileImg}
                      alt="user pic"
                      className="user-profile-pic"
                    />
                  </div>
                  <div className="user-meta-data">
                    <span className="user-profile-name">{authUser.fullName}</span>
                    <span className="user-name">{authUser.userName}</span>
                  </div>
                </div>
                <div className="change-photo-btn">
                  <ActionButton
                    onclick={handleChancePhoto}
                    title="Change photo"
                    isUrlBtn={false}
                  />
                </div>
              </div>
              <div className="input">
                <span className="input-headings">Website</span>
                <input disabled placeholder="Website" type="text" />
                <span className="input-instruction">
                  Editing your links is only available on mobile. Visit the
                  Instagram app and edit your profile to change the websites in
                  your bio.
                </span>
              </div>

              <div className="input">
                <span className="input-headings">Bio</span>
                <div className="text-area">
                  <textarea
                    maxLength="150"
                    value={userBio ? userBio : authUser.userBio}
                    onChange={(e) => handleBioOnChange(e)}
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                  ></textarea>
                  <div className="textarea-keyword-count">
                    <span className="keyword-count">
                      <span className="count">{userBioLength}</span> / 150
                    </span>
                  </div>
                </div>
              </div>

              <div className="input">
                <span className="input-headings">Gender</span>
                <div
                  ref={genderCard}
                  className="gender-selector"
                  onClick={() => {
                    setIsGenderListActive(!isGenderListActive);
                  }}
                >
                  <div className="selector">
                    <span className="selected-gender">
                      {gender ? gender : authUser.userGender}
                    </span>
                    <span className="selector-icon">
                      <svg
                        aria-label="Down chevron"
                        className="x1lliihq x1n2onr6 x10xgr34"
                        fill="currentColor"
                        height={12}
                        role="img"
                        viewBox="0 0 24 24"
                        width={12}
                      >
                        <title>Down chevron</title>
                        <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div
                  className={
                    isGenderListActive
                      ? "selector-list active"
                      : "selector-list"
                  }
                >
                  <ul>
                    <li
                      name="Female"
                      onClick={(e) => selectorItemClick(0, e)}
                      className="selector-list-item"
                    >
                      <div className="list-item-content">
                        <span className="selector-name">Female</span>
                        <div className="selector-check">
                          <div
                            className={
                              authUser.userGender == "Female"
                                ? "selector-check-box active"
                                : "selector-check-box"
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
                    </li>
                    <li
                      name="Male"
                      onClick={(e) => selectorItemClick(1, e)}
                      className="selector-list-item"
                    >
                      <div className="list-item-content">
                        <span className="selector-name">Male</span>
                        <div className="selector-check">
                          <div
                            className={
                              authUser.userGender == "Male"
                                ? "selector-check-box active"
                                : "selector-check-box"
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
                    </li>
                    <li
                      name="Custom"
                      onClick={(e) => selectorItemClick(2, e)}
                      className="selector-list-item"
                    >
                      <div className="list-item-content">
                        <span className="selector-name">Custom</span>
                        <div className="selector-check">
                          <div
                            className={
                              authUser.userGender != "Female" &&
                                authUser.userGender != "Male" &&
                                authUser.userGender != "Prefer not to say"
                                ? "selector-check-box active"
                                : "selector-check-box"
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
                    </li>

                    <div className="custom-gender-input">
                      <input
                        value={customGenderValue}
                        onChange={(e) => handleCustomGenderOnChange(e)}
                        ref={customGender}
                        type="text"
                        className="gender-input"
                      />
                    </div>
                    <li
                      name="Prefer not to say"
                      onClick={(e) => selectorItemClick(3, e)}
                      className="selector-list-item"
                    >
                      <div className="list-item-content">
                        <span className="selector-name">Prefer not to say</span>
                        <div className="selector-check">
                          <div
                            className={
                              authUser.userGender == "Prefer not to say"
                                ? "selector-check-box active"
                                : "selector-check-box"
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
                    </li>
                  </ul>
                </div>
                <span className="input-instruction">
                  This won’t be part of your public profile.
                </span>
              </div>

              <div className="input">
                <span className="input-headings">
                  Show account suggestions on profiles
                </span>
                <div className="ac-suggestion-active-card">
                  <div className="ac-sugg-card-content">
                    <span className="ac-suggestion-heading">
                      Show account suggestions on profiles
                    </span>
                    <span className="input-instruction">
                      Choose whether people can see similar account suggestions
                      on your profile, and whether your account can be suggested
                      on other profiles.
                    </span>
                  </div>
                  <div className="card-btn">
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-submit-btn">
                <button
                  disabled={gender || userBio ? false : true}
                  onClick={handleFormSubmit}
                  type="button"
                  className="edit-form-submit-btn"
                >
                  <div
                    className={
                      gender || userBio ? "btn-overlay" : "btn-overlay active"
                    }
                  ></div>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <AuthFooter />
      </div>
    </>
  );
};

export default MainProfileEdit;
