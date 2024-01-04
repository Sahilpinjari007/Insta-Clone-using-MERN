import express from 'express';
import { checkPostLiked, createPost, getPostLikedUsers, getPosts, postLike } from '../controllers/post.js';

const router = express.Router();



router.get('/fetch', getPosts);
router.post('/create', createPost)
router.post('/like', postLike);
router.post('/checkPostLiked', checkPostLiked);
router.post('/fetchPostLikedUsers', getPostLikedUsers);


export default router;