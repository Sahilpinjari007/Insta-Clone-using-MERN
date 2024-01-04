import React from 'react';
import './ActionButton.css'
import { Link } from 'react-router-dom';

const ActionButton = ({ title, path = '', isUrlBtn, onclick, color = '#363636'}) => {
  return (
    <>
      {
        isUrlBtn ? (<Link to={path}>
          <button className='action-button' style={{backgroundColor: color}}>
            {title}
          </button>
        </Link>)
          : (<button type='button' onClick={onclick} className='action-button'  style={{backgroundColor: color}}>
            {title}
          </button>)
      }
    </>
  );
}

export default ActionButton;
