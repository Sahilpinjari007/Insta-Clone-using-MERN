import React, { useEffect, useState } from "react";
import "./ProfilePosts.css";
import { NavLink, Outlet, matchPath } from "react-router-dom";
import AuthFooter from '../../AuthFooter/AuthFooter';

const ProfilePosts = () => {

  return (
    <>
      <div className="profile-posts-section">
        <header className="profile-posts-section-header">
          <nav className="post-navigation">
            <ul>
              <li className="post-nav-item">
                <NavLink to='' className={({ isActive }) => isActive ? 'activeNav' : ''}>
                  <div className="nav-item-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label=""
                      className="x1lliihq x1n2onr6 x1roi4f4"
                      fill="currentColor"
                      height={12}
                      role="img"
                      viewBox="0 0 24 24"
                      width={12}
                    >
                      <title />
                      <polygon
                        fill="none"
                        points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span>POSTS</span>
                  </div>
                </NavLink>
              </li>

              <li className="post-nav-item">
                <NavLink to='reels' className={({ isActive }) => isActive ? 'activeNav' : ''}>
                  <div className="nav-item-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label=""
                      className="x1lliihq x1n2onr6 x1roi4f4"
                      fill="currentColor"
                      height={12}
                      role="img"
                      viewBox="0 0 24 24"
                      width={12}
                    >
                      <title />
                      <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        x1="2.049"
                        x2="21.95"
                        y1="7.002"
                        y2="7.002"
                      />
                      <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        x1="13.504"
                        x2="16.362"
                        y1="2.001"
                        y2="7.002"
                      />
                      <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        x1="7.207"
                        x2="10.002"
                        y1="2.11"
                        y2="7.002"
                      />
                      <path
                        d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z"
                        fillRule="evenodd"
                      />
                    </svg>
                    <span>REELS</span>
                  </div>
                </NavLink>
              </li>

              <li className="post-nav-item">
                <NavLink to='saved' className={({ isActive }) => isActive ? 'activeNav' : ''}>
                  <div className="nav-item-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label=""
                      className="x1lliihq x1n2onr6 x1roi4f4"
                      fill="currentColor"
                      height={12}
                      role="img"
                      viewBox="0 0 24 24"
                      width={12}
                    >
                      <title />
                      <polygon
                        fill="none"
                        points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span>SAVED</span>
                  </div>
                </NavLink>
              </li>

              <li className="post-nav-item">
                <NavLink to='tagged' className={({ isActive }) => isActive ? 'activeNav' : ''}>
                  <div className="nav-item-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label=""
                      className="x1lliihq x1n2onr6 x1roi4f4"
                      fill="currentColor"
                      height={12}
                      role="img"
                      viewBox="0 0 24 24"
                      width={12}
                    >
                      <title />
                      <path
                        d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v14.104a1.818 1.818 0 0 1-1.818 1.818H3.818A1.818 1.818 0 0 1 2 20.184V6.08a1.818 1.818 0 0 1 1.818-1.818h5.26a1.59 1.59 0 0 0 1.123-.465Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M18.598 22.002V21.4a3.949 3.949 0 0 0-3.948-3.949H9.495A3.949 3.949 0 0 0 5.546 21.4v.603"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <circle
                        cx="12.072"
                        cy="11.075"
                        fill="none"
                        r="3.556"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span>TAGGED</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <main className="nav-page-changer-section">
          <Outlet />
        </main>
      </div>
      <AuthFooter />
    </>
  );
};

export default ProfilePosts;
