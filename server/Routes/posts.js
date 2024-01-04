import express from 'express';
import { checkPostLiked, checkPostSaved, createPost, getPostLikedUsers, getPosts, insertComment, postLike, savePost } from '../controllers/post.js';

const router = express.Router();



router.get('/fetch', getPosts);
router.post('/create', createPost)
router.post('/like', postLike);
router.post('/checkPostLiked', checkPostLiked);
router.post('/fetchPostLikedUsers', getPostLikedUsers);
router.post('/save', savePost)
router.post('/checkPostSaved', checkPostSaved);
router.post('/insertComment', insertComment);


export default router;