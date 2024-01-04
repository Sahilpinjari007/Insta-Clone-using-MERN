import React from "react";
import "./EmailSignUp.css";
import SignUp from "../../components/SignfUp/SignUp";
import AuthFooter from "../../components/AuthFooter/AuthFooter";

const EmailSignUp = () => {
  return (
    <>
      <div className="signUp-page">
        <SignUp />
      </div>
      <AuthFooter />
    </>
  );
};

export default EmailSignUp;
