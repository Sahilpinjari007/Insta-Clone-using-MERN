import express from 'express';
import { checkPostLiked, checkPostSaved, createPost, deleteComment, getComments, getPostLikedUsers, getPosts, getUserPosts, getUserReels, insertComment, postLike, savePost } from '../controllers/post.js';

const router = express.Router();



router.get('/fetch', getPosts);
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


export default router;