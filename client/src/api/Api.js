import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';


const API = axios.create({ baseURL: 'http://localhost:5000' });


// it is return direct api response
export const signUp = (formData) => API.post('/auth/user/signup', formData);
export const signIn = (formData) => API.post('/auth/user/signin', formData);


// current user operations
export const getUser = (userId) => API.get(`/user/operations/getUser/${userId}`);
export const profileImgUpdate = (data) => API.put('/user/operations/profileImage/update', data);
export const updateProfile = (formData) => API.put('/user/operations/genderBio/update', formData);
export const getUserByUserName = (userName) => API.get(`/user/operations/getUser/userName/${userName}`);
export const followUser = (data) => API.put('/user/operations/follow/add', data);
export const unfollowUser = (data) => API.put('/user/operations/follow/remove', data);
export const checkUserFollowed = (data) => API.put('/user/operations/follow/check', data);
export const getUserFollowers = (data) => API.post('/user/operations/followers/get', data);
export const getUserFollowings = (data) => API.post('/user/operations/followings/get', data);
export const searchUsers = (query) => API.get('/user/operations/getAll', {params: query});

// post
export const getPosts = () => API.get(`/insgaram/posts/fetch`);
export const createPost = (formData) => API.post('/insgaram/posts/create', formData)
export const likePost = (formData) => API.post(`insgaram/posts/like`, formData);
export const checkPostLiked = (formData) => API.post(`/insgaram/posts/checkPostLiked`, formData);
export const fetchPostLikedUsers = (formData) => API.post(`/insgaram/posts/fetchPostLikedUsers`, formData);
export const savePost = (formData) => API.post(`/insgaram/posts/save`, formData);
export const checkPostSaved = (formData) => API.post(`/insgaram/posts/checkPostSaved`, formData);
export const insertComment = (formData) => API.post(`/insgaram/posts/insertComment`, formData);



