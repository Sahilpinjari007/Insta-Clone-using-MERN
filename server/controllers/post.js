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

    try {
        const query = `INSERT INTO allposts(postId, postUserUserId, postTitle, postMetaData, postTimeStamp, postType, postVideoURL, singlePostImgURL, isPostContainSong, postSongTitle, postSongURL, isMultiplePost, multipleImgPostURLS, isPostTaged, postTagList, postLikes) VALUES ('${v4()}','${data.postUserUserId}','${data.postTitle}','${data.postMetaData}','${data.postTimeStamp}','${data.postType}','${data.postVideoURL}','${data.singlePostImgURL}','${data.isPostContainSong}','${data.postSongTitle}','${data.postSongURL}','${data.isMultiplePost}','${data.multipleImgPostURLS}','${data.isPostTaged}','${data.postTagList}', ${data.postLikes})`;

        conn.query(query, (err, result) => {

            if (err) return res.status(500).json({ message: 'Unable to Create Post', code: 400, err });

            if (result.affectedRows >= 1) {
                return res.status(200).json({ message: 'Post Create SuccessFul!', code: 200 });
            }
            else {
                return res.status(500).json({ message: 'Unable to Create Post', code: 201 });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable to Create Post', code: 400, err });
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

export const getPostLikedUsers = async (req, res) => {


    const data = req.body;

    try {
        const query = `
        SELECT *
        FROM users 
        JOIN followers ON users.userId = followers.followerUserId
        JOIN postlikes ON users.userId = postlikes.likedUserId
        WHERE postlikes.postId = '${data.postId}'
        AND followers.followingUserId = "${data.authUserId}" LIMIT 3;`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable to fetch post Liked Users!', code: 400, err });

            if (Array.from(result).length >= 1) {
                return res.status(200).json({ message: 'post Liked Users Featched!', code: 200, result });
            }
            else {
                return res.status(200).json({ message: 'Post Liked Users Not Avilable!', code: 201, result: [] });
            }
        })

    }
    catch (err) {
        return res.status(500).json({ message: 'Unable to fetch post Liked Users!', code: 400, err });
    }
}

export const savePost = async (req, res) => {

    const data = req.body;

    // userId postId

    try {

        let query = `SELECT * FROM savedposts WHERE postId = '${data.postId}' AND userId = '${data.userId}';`;

        // check post are alredy saved or not
        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable to Save Post', code: 400, err });

            // its means post is already saved unsave it
            if (Array.from(result).length >= 1) {
                query = `DELETE FROM savedposts WHERE postId = '${data.postId}' AND userId = '${data.userId}';`;

                conn.query(query, (err, result) => {
                    if (err) return res.status(500).json({ message: 'Unable to UnSave Post', code: 400, err });

                    if (result.affectedRows >= 1) {
                        return res.status(200).json({ message: 'Post UnSaved SuccessFul!', code: 200, value: false })
                    }
                    else {
                        return res.status(200).json({ message: 'Unable to UnSaved Post!', code: 201 })
                    }
                })
            } // its means post are not saved save it
            else {
                query = `INSERT INTO savedPosts (savedPostId, postId, userId) VALUES ('${v4()}','${data.postId}','${data.userId}');`;

                conn.query(query, (err, result) => {
                    if (err) return res.status(500).json({ message: 'Unable to Save Post!', code: 400, err });

                    if (result.affectedRows >= 1) {
                        return res.status(200).json({ message: 'Post Saved SuccessFul!', code: 200, value: true });
                    }
                    else {
                        return res.status(200).json({ message: 'Unable to Save Post!', code: 201 })
                    }
                })
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable to Save Post', code: 400, err });
    }
}

export const checkPostSaved = async (req, res) => {

    const data = req.body;

    try {
        const query = `SELECT * FROM savedposts WHERE postId = '${data.postId}' AND userId = '${data.userId}';`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable to Check Post Saved or Not!', code: 400, err });

            if (Array.from(result).length >= 1) {
                return res.status(200).json({ message: 'Post Are Saved!', code: 200, value: true });
            }
            else {
                return res.status(200).json({ message: 'Post Are Not Saved!', code: 200, value: false });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable to Check Post Saved or Not!', code: 400, err });
    }
}

export const insertComment = async (req, res) => {

    //postId postUserId	commentedUserId	message	timeStamp	
    const data = req.body;

    try {

        const query = `INSERT INTO postComments(commentId, postId, postUserId, commentedUserId, message, timeStamp) VALUES ('${v4()}','${data.postId}','${data.postUserId}','${data.commentedUserId}','${data.message}','${data.timeStamp}')`

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable to Comment on Post!', code: 400, err });

            if (result.affectedRows >= 1) {
                return res.status(200).json({ message: 'Commented On Post!', code: 200 });
            }
            else {
                return res.status(200).json({ message: 'Unable to Comment on Post!', code: 201 });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable to Comment on Post!', code: 400, err });
    }
}

export const getComments = async (req, res) =>{
    
    const postId = req.params.postId;

    try{
        const query = `SELECT * FROM postcomments WHERE postId = '${postId}'`;

        conn.query(query, (err, result) =>{
            if(err)  return res.status(500).json({message: 'Unable to Featch Comments!', code: 400, err});

            if(Array.from(result).length >= 1){
                return res.status(200).json({message: 'All Comment Featched!', code: 200, result});
            }
            else{
                return res.status(200).json({message: 'Comments are not Available for This Post', code: 201, result: []});
            }
        })
    }
    catch(err){
        return res.status(500).json({message: 'Unable to Featch Comments!', code: 400, err});
    }
}

export const deleteComment = async (req, res)=>{

    const commentId = req.params.commentId;

    try{
        const query = `DELETE FROM Postcomments WHERE commentId = '${commentId}'`;

        conn.query(query, (err, result) => {
            if(err) return res.status(500).json({message: 'Unable to Delete Comment!', code: 400, err})

            if(result.affectedRows >= 1){
                return res.status(200).json({message: 'Comment Deleted SuccessFul!', code: 200});
            }
            else{
                return res.status(200).json({message: 'Unable to Delete Comment!', code: 201});
            }
        })
    }
    catch(err){
        return res.status(500).json({message: 'Unable to Delete Comment!', code: 400, err})
    }
}