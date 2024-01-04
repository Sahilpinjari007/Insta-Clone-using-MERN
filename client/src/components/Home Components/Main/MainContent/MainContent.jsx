import React from 'react';
import './MainContent.css'
import StoryRow from './StoryRow/StoryRow';
import Posts from './Posts/Posts';

const MainContent = () => {
  return (
    <main className="main-intraction">
      <StoryRow />
      <Posts />
    </main>
  );
}

export default MainContent;
