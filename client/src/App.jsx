import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import NewUser from "./pages/newUser/NewUser";
import LoginPage from "./pages/logIn/LoginPage";
import EmailSignUp from "./pages/emailSignUp/EmailSignUp";
import Home from "./pages/Home/Home";
import { AppProvider } from "./Context/context";
import Loader from "./components/Loader/Loader";
import Nav from "./components/Home Components/Nav/Nav";
import Profile from "./pages/Profile/Profile";

// profile nav pages
import NavPostPage from "./components/Profile Components/ProfilePosts/NavPostsPage/NavPostsPage";
import NavReelsPage from "./components/Profile Components/ProfilePosts/NavReelsPage/NavReelsPage";
import NavSavedPage from "./components/Profile Components/ProfilePosts/NavSavedPage/NavSavedPage";
import NavTagsPage from "./components/Profile Components/ProfilePosts/NavTagsPage/NavTagsPage";
import EditProfile from "./pages/EditProfile/EditProfile";
import Dailog from "./components/Dailog/Dailog";
import { AppContext } from "./Context/context";
import CheckFollowerDailog from "./components/CheckFollowerDailog/CheckFollowerDailog";
import CheckFollowingDailog from "./components/CheckFollowingDailog/CheckFollowingDailog";
import CreatePostDailog from "./components/CreateMediaDailogs/CreatePostDailog";
import AleartMessage from "./components/AleartMessage/AleartMessage";

const CombineHome = () => {

  const { showProfileDailog, createPostDailog } = useContext(AppContext);

  return (
    <div className={showProfileDailog || createPostDailog ? "home-content active" : "home-content"}>
      <Nav />
      <div className="app-pages">
        <Outlet />
      </div>
      {showProfileDailog &&
        <Dailog />}
      {
        createPostDailog && <CreatePostDailog />
      }
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <>
          <Loader />
          <Routes>
            <Route
              path=""
              element={
                localStorage.getItem("profile") ? (
                  <CombineHome />
                ) : (
                  <NewUser />
                )
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/accounts/edit/" element={<EditProfile />} />

              <Route path="/:userName" element={<Profile />}>
                <Route path="" index element={<NavPostPage />}>

                </Route>
                <Route path="reels/" element={<NavReelsPage />} />
                <Route path="saved/" element={<NavSavedPage />} />
                <Route path="tagged/" element={<NavTagsPage />} />
                <Route path="followers/" element={<CheckFollowerDailog />} />
                <Route path="following/" element={<CheckFollowingDailog />} />
              </Route>
            </Route>
            <Route path="accounts/login" element={<LoginPage />} />
            <Route path="accounts/emailsignup" element={<EmailSignUp />} />
          </Routes>
          <AleartMessage />
        </>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
