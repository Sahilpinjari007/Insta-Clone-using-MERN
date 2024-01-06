import React, { useEffect, useRef, useState } from "react";
import "./ViewUserMedia.css";

const ViewUserMedia = () => {
  const [multiplePosts, setMultiplePosts] = useState([
    "/insta imgs/viewpost.jpeg",
    "/insta imgs/viewposts.jpeg",
    "/insta imgs/instapo.jpeg",
  ]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const MultiplePostsSection = useRef(null);

  const hanldeRightPostScroll = () => {
    if (currentImgIndex !== multiplePosts.length - 1) {
      setCurrentImgIndex(currentImgIndex + 1);
    }
    console.log(currentImgIndex);
  };

  const handleLeftPostScroll = () => {
    if (currentImgIndex !== 0) {
      setCurrentImgIndex(currentImgIndex - 1);
    }
    console.log(currentImgIndex);
  };

  return (
    <div className="viewUserMedia-section">
      <div className="viewUserMedia-section-content">
        <div className="close-viewUserMedia-dailog-btn">
          <svg
            aria-label="Close"
            className="x1lliihq x1n2onr6 x5n08af"
            fill="currentColor"
            height={18}
            role="img"
            viewBox="0 0 24 24"
            width={18}
          >
            <title>Close</title>
            <polyline
              fill="none"
              points="20.643 3.357 12 12 3.353 20.647"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
            />
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              x1="20.649"
              x2="3.354"
              y1="20.649"
              y2="3.354"
            />
          </svg>
        </div>
        <div className="viewUserMedia-dailog">
          <article className="viewUserMedia-dailog-content">
            <div className="viewUserMedia-articale-content">
              <div className="viewUserMedia-media-section">
                <div className="viewUserMedia-media-section-content">
                  <div className="img-media-content">
                    <div className="viewUserMedia-img-layout">
                      <img
                        draggable={false}
                        src={multiplePosts[currentImgIndex]}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="video-media-content"></div>

                  <div className="viewUserMedia-media-section-footer">
                    <div className="viewUserMedia-media-section-footer-content">
                      <div className="tag-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label="Tags"
                          className="x1lliihq x1n2onr6 x9bdzbf"
                          fill="currentColor"
                          height="12"
                          role="img"
                          viewBox="0 0 24 24"
                          width="12"
                        >
                          <title>Tags</title>
                          <path d="M21.334 23H2.666a1 1 0 0 1-1-1v-1.354a6.279 6.279 0 0 1 6.272-6.272h8.124a6.279 6.279 0 0 1 6.271 6.271V22a1 1 0 0 1-1 1ZM12 13.269a6 6 0 1 1 6-6 6.007 6.007 0 0 1-6 6Z" />
                        </svg>
                      </div>

                      <div className="current-post-active-thumbs">
                        {multiplePosts?.map((elem, i) => {
                          return (
                            <div
                              className={
                                currentImgIndex === i
                                  ? "current-post-thumb active"
                                  : "current-post-thumb"
                              }
                            ></div>
                          );
                        })}
                      </div>

                      <div className="audio-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label="Audio is playing"
                          className="x1lliihq x1n2onr6 x9bdzbf"
                          fill="currentColor"
                          height="12"
                          role="img"
                          viewBox="0 0 24 24"
                          width="12"
                        >
                          <title>Audio is playing</title>
                          <path d="M16.636 7.028a1.5 1.5 0 1 0-2.395 1.807 5.365 5.365 0 0 1 1.103 3.17 5.378 5.378 0 0 1-1.105 3.176 1.5 1.5 0 1 0 2.395 1.806 8.396 8.396 0 0 0 1.71-4.981 8.39 8.39 0 0 0-1.708-4.978Zm3.73-2.332A1.5 1.5 0 1 0 18.04 6.59 8.823 8.823 0 0 1 20 12.007a8.798 8.798 0 0 1-1.96 5.415 1.5 1.5 0 0 0 2.326 1.894 11.672 11.672 0 0 0 2.635-7.31 11.682 11.682 0 0 0-2.635-7.31Zm-8.963-3.613a1.001 1.001 0 0 0-1.082.187L5.265 6H2a1 1 0 0 0-1 1v10.003a1 1 0 0 0 1 1h3.265l5.01 4.682.02.021a1 1 0 0 0 1.704-.814L12.005 2a1 1 0 0 0-.602-.917Z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div
                    className="viewUserMedia-left-scroll-btn"
                    onClick={handleLeftPostScroll}
                  ></div>
                  <div
                    className="viewUserMedia-right-scroll-btn"
                    onClick={hanldeRightPostScroll}
                  ></div>
                </div>
              </div>
              <div className="viewUserMedia-media-meta-data-section"></div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ViewUserMedia;
