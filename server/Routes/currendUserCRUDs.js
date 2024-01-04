import express from "express";
import { getUser, getUserByUserName, addFollowe, updateProfile, updateProfileImg, removeFollow, checkUserFollowing, getUserFollowers, getUserFollowering, getUsers } from "../controllers/currendUserCRUD.js";

const router = express.Router();



router.put('/profileImage/update', updateProfileImg)
router.get('/getUser/:userId', getUser);
router.put('/genderBio/update', updateProfile);
router.get('/getUser/userName/:userName', getUserByUserName)
router.put('/follow/add', addFollowe);
router.put('/follow/remove', removeFollow);
router.put('/follow/check', checkUserFollowing)
router.post('/followers/get', getUserFollowers);
router.post('/followings/get', getUserFollowering);
router.post('/followercount/get', getUserFollowers);
router.get('/getAll', getUsers)

export default router;