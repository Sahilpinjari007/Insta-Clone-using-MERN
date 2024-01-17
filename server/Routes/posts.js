import express from 'express';
import { checkPostLiked, checkPostSaved, createPost, deleteComment, getComments, getPost, getPostLikedUsers, getPosts, getTaggedPost, getUserPosts, getUserReels, getUserSavedPosts, insertComment, postLike, savePost } from '../controllers/post.js';

const router = express.Router();



router.get('/fetch', getPosts);
router.get('/featchPost/:postId', getPost)
router.post('/create', createPost)
router.post('/like', postLike);
router.post('/checkPostLiked', checkPostLiked);
router.post('/fetchPostLikedUsers', getPostLikedUsers);
router.post('/save', savePost)
router.post('/checkPostSaved', checkPostSaved);
router.post('/insertComment', insertComment);
router.get('/getPostComments/:postId', getComments)
router.delete('/deleteComment/:commentId', deleteComment);
router.get('/fetchUserPosts/:userId', getUserPosts);
router.get('/getUserReels/:userId', getUserReels);
router.get('/getUserSavedPosts/:userId', getUserSavedPosts);
router.get('/getTaggedPosts/:userId', getTaggedPost);


export default router;