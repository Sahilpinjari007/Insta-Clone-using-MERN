import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../Context/context';
import './Home.css'
import MainContent from '../../components/Home Components/Main/MainContent/MainContent'
import UserSaggestions from '../../components/Home Components/Main/UserSaggestions/UserSaggestions'
import TopHeader from '../../components/Home Components/TopHeader/TopHeader'

const Home = () => {


  return (
    <>
      <div className='main-intaraction-section'>
        <TopHeader />
        <MainContent />
        <UserSaggestions />
      </div>
    </>
  );
}

export default Home;
