import { conn } from "../DB.js";
import { v4 } from "uuid";


export const getPosts = async (req, res) => {


    try {
        const query = `SELECT * FROM allposts;`

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Enable to featch Posts!', code: 400, err });

            if (Array.from(result).length > 1) {
                return res.status(200).json({ message: 'All Posts are Featched!', code: 200, result });
            }
            else {
                return res.status(200).json({ message: 'Posts are not Avialbel!', code: 201, result });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Enable to featch Posts!', code: 400, err });
    }
}

export const createPost = async (req, res) => {

    const data = req.body;

    try{
        const query = `INSERT INTO allposts(postId, postUserUserId, postTitle, postMetaData, postTimeStamp, postType, postVideoURL, singlePostImgURL, isPostContainSong, postSongTitle, postSongURL, isMultiplePost, multipleImgPostURLS, isPostTaged, postTagList, postLikes) VALUES ('${v4()}','${data.postUserUserId}','${data.postTitle}','${data.postMetaData}','${data.postTimeStamp}','${data.postType}','${data.postVideoURL}','${data.singlePostImgURL}','${data.isPostContainSong}','${data.postSongTitle}','${data.postSongURL}','${data.isMultiplePost}','${data.multipleImgPostURLS}','${data.isPostTaged}','${data.postTagList}', ${data.postLikes})`;

        conn.query(query, (err, result)=>{

            if(err) return res.status(500).json({message: 'Unable to Create Post', code: 400, err});

            if(result.affectedRows >= 1){
                return res.status(200).json({message: 'Post Create SuccessFul!', code: 200});
            }
            else{
                return res.status(500).json({message: 'Unable to Create Post', code: 201});
            }
        })
    }
    catch(err){
        return res.status(500).json({message: 'Unable to Create Post', code: 400, err});
    }
}

export const postLike = async (req, res) => {

    const data = req.body;

    try {
        let query = `SELECT * FROM postLikes WHERE postId = '${data.postId}' and likedUserId = '${data.likedUserId}' and postUserId = '${data.postUserId}';`;


        // check user Already liked or not post
        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable to Check post Liked!', code: 400, err });

            // user Already liked post unlike it
            if (Array.from(result).length >= 1) {

                query = `DELETE FROM postLikes WHERE postId = '${data.postId}' and likedUserId = '${data.likedUserId}' and postUserId = '${data.postUserId}';`

                conn.query(query, (err, result) => {
                    if (err) return res.status(500).json({ message: 'Unable to UnLike post!', code: 400, err });

                    if (result.affectedRows >= 1) {

                        // decrees post likes
                        query = `UPDATE allposts SET postLikes=${data.postLikes - 1} WHERE postId='${data.postId}'`;

                        conn.query(query, (err, result) => {
                            if (err) return res.status(500).json({ message: 'Unable to Decrease Post Likes!', code: 400, err });

                            if (result.affectedRows >= 1) {
                                return res.status(200).json({ message: 'post Unliked SuccessFul!', code: 200, value: false });
                            }
                            else {
                                return res.status(200).json({ message: 'Unable to Decrease Post Likes!', code: 400, err });
                            }
                        })
                    }
                    else {
                        return res.status(500).json({ message: 'Unable to UnLike post!', code: 201, err });
                    }
                })
            } // user not liked post like post
            else {
                query = `INSERT INTO postLikes (likeId, postId, postUserId, likedUserId) VALUES ('${v4()}','${data.postId}','${data.postUserId}','${data.likedUserId}');`;

                conn.query(query, (err, result) => {
                    if (err) return res.status(500).json({ message: 'Unable to Like post!', code: 400, err });

                    if (result.affectedRows >= 1) {

                        // increase post likes
                        query = `UPDATE allposts SET postLikes=${data.postLikes + 1} WHERE postId='${data.postId}'`;

                        conn.query(query, (err, result) => {
                            if (err) return res.status(500).json({ message: 'Unable to Increase Post Likes!', code: 400, err });

                            if (result.affectedRows >= 1) {
                                res.status(200).json({ message: 'Post liked SuccessFul!', code: 200, value: true });
                            }
                            else {
                                return res.status(200).json({ message: 'Unable to Increase Post Likes!', code: 400, err });
                            }
                        })
                    }
                    else {
                        return res.status(200).json({ message: 'Unable to Like post!', code: 400, err });
                    }
                })
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable to Like Post!', code: 400, err });
    }
}

export const checkPostLiked = async (req, res) => {

    const data = req.body;

    try {
        const query = `SELECT * FROM postLikes WHERE postId='${data.postId}' and likedUserId='${data.likedUserId}' and postUserId='${data.postUserId}';`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable to Check post Liked!', code: 400, err });

            if (Array.from(result).length >= 1) {
                return res.status(200).json({ message: 'post are Liked!', code: 200, value: true });
            }
            else {
                return res.status(200).json({ message: 'post are not Liked!', code: 200, value: false });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable to Check post Liked!', code: 400, err });
    }
}

export const getPostLikedUsers = async (req, res) =>{


    const data = req.body;
    
    // {
    //     "postId": "e12244dc-32db-4d47-bf37-a3d97fbd6652",
    //     "authUserId": "74c41d99-35e0-4bb9-b87b-1521bfad6373"
    // }
}