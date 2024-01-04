import React from 'react';
import './login.css'
import LogIn from '../../components/Login/LogIn';
import AuthFooter from '../../components/AuthFooter/AuthFooter';

const LoginPage = () => {
  return (
    <>
      <div className='login-page'>
        <LogIn />
      </div>

      <AuthFooter />
    </>
  );
}

export default LoginPage;
