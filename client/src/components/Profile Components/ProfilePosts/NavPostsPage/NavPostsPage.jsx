import React, { useRef } from "react";
import "./NavPostsPage.css";

const NavPostPageCard = ({ cardData }) => {
  return (
    <div className="nav-post-page-card">
      <div className="card-hover">
        <div className="card-details">
          <div className="card-likes">
            <div className="like-icon"></div>
            <span className="card-like-count">41</span>
          </div>
          <div className="card-comments">
            <div className="comment-icon"></div>
            <span className="card-comment-count">41</span>
          </div>
        </div>
      </div>
      <div className="card-contain">
        <img src={cardData.img} alt="" className="card-img" />
      </div>
    </div>
  );
};

const NavPostsPage = () => {
  const posts = [
    { img: "/profile imgs/asset 4.jpeg" },
    { img: "/profile imgs/asset 5.jpeg" },
    { img: "/profile imgs/asset 6.jpeg" },
    { img: "/profile imgs/asset 7.jpeg" },
    { img: "/profile imgs/asset 8.jpeg" },
    { img: "/profile imgs/asset 9.jpeg" },
    { img: "/profile imgs/asset 10.jpeg" },
    { img: "/profile imgs/asset 11.jpeg" },
  ];

  const handleCardOnClick = (index) => {
    const allCards = Array.from(document.querySelectorAll(".post-card"));

    allCards.forEach((elem) => {
      elem.classList.remove("cardClick");
    });

    allCards[index].classList.add("cardClick");
  };

  return (
    <>
      <div className="nav-post-page">
        {posts.map((elem, i) => {
          return (
            <div
              key={i}
              className="post-card"
              onClick={() => handleCardOnClick(i)}
            >
              <NavPostPageCard cardData={elem} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NavPostsPage;
