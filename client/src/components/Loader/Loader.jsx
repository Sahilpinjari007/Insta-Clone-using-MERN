import React, { useContext } from 'react';
import './Loader.css';
import { AppContext } from '../../Context/context';

const Loader = () => {

  const { loading } = useContext(AppContext);

  return (
    <>
      {loading && (<div className='load-bar'>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>)}
    </>
  );
}

export default Loader;
