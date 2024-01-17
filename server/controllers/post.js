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

export const getPost = async (req, res) => {

    const postId = req.params.postId;

    try {
        const query = `SELECT * FROM allposts WHERE postId = '${postId}';`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable to featch Post!', code: 400, err });

            if (Array.from(result).length >= 1) {
                return res.status(200).json({ message: 'Post are Available!', code: 200, result: result[0] });
            }
            else {
                return res.status(200).json({ message: 'Post are not Available!', code: 201, result: {} });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable to featch Post!', code: 400, err });
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

                                // delete notification of post liked
                                query = `DELETE FROM notification WHERE LikedPostId = '${data.postId}' and 	notifyByUserId = '${data.likedUserId}' and userId  = '${data.postUserId}';`;

                                conn.query(query, (err, result) => {
                                    if (err) return res.status(500).json({ message: 'Unable to Remove Notification Of Post Liked!', code: 502, err });

                                    if (result.affectedRows >= 1) {
                                        return res.status(200).json({ message: 'post Unliked SuccessFul!', code: 200, value: false });
                                    }
                                    else {
                                        return res.status(500).json({ message: 'Unable to Remove Notification Of Post Liked!', code: 502, err });
                                    }
                                })
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

                                // insert notification of post liked
                                query = `INSERT INTO notification(notificationId, userId, notifyByUserId, message, action, isRead, TimeStamp, LikedPostId) VALUES ('${v4()}', '${data.postUserId}', '${data.likedUserId}', 'liked your post.', 'postlike','false','${new Date()}', '${data.postId}')`;;

                                conn.query(query, (err, result) => {
                                    if (err) return res.status(500).json({ message: 'Unable to add Notification Of Post Liked!', code: 502, err });

                                    if (result.affectedRows >= 1) {
                                        return res.status(200).json({ message: 'Post liked SuccessFul!', code: 200, value: true });
                                    }
                                    else {
                                        return res.status(500).json({ message: 'Unable to add Notification Of Post Liked!', code: 502, err });
                                    }
                                })
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
    const commentId = v4();

    try {

        let query = `INSERT INTO postComments(commentId, postId, postUserId, commentedUserId, message, timeStamp) VALUES ('${commentId}','${data.postId}','${data.postUserId}','${data.commentedUserId}','${data.message}','${data.timeStamp}')`

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable to Comment on Post!', code: 400, err });

            if (result.affectedRows >= 1) {

                // insert notification
                query = `INSERT INTO notification(notificationId, userId, notifyByUserId, message, action, isRead, TimeStamp, CommentId, LikedPostId) VALUES ('${v4()}', '${data.postUserId}', '${data.commentedUserId}', 'commented on your post.', 'postComment','false','${new Date()}', '${commentId}', '${data.postId}')`;

                conn.query(query, (err, result) => {
                    if (err) return res.status(500).json({ message: 'Unable to add Notification Of Comment!', code: 502, err });

                    if (result.affectedRows >= 1) {
                        return res.status(200).json({ message: 'Commented On Post!', code: 200 });
                    }
                    else {
                        return res.status(500).json({ message: 'Unable to add Notification Of Comment!', code: 502, err });
                    }
                })
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

export const getComments = async (req, res) => {

    const postId = req.params.postId;

    try {
        const query = `SELECT * FROM postcomments WHERE postId = '${postId}'`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable to Featch Comments!', code: 400, err });

            if (Array.from(result).length >= 1) {
                return res.status(200).json({ message: 'All Comment Featched!', code: 200, result });
            }
            else {
                return res.status(200).json({ message: 'Comments are not Available for This Post', code: 201, result: [] });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable to Featch Comments!', code: 400, err });
    }
}

export const deleteComment = async (req, res) => {

    const commentId = req.params.commentId;

    try {
        let query = `DELETE FROM Postcomments WHERE commentId = '${commentId}'`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable to Delete Comment!', code: 400, err })

            if (result.affectedRows >= 1) {

                // delete comment notification
                query = `DELETE FROM notification WHERE CommentId='${commentId}';`;

                conn.query(query, (err, result) => {
                    if (err) return res.status(500).json({ message: 'Unable to Remove Notification Of Comment!', code: 502, err });

                    if (result.affectedRows >= 1) {
                        return res.status(200).json({ message: 'Comment Deleted SuccessFul!', code: 200 });
                    }
                    else {
                        return res.status(500).json({ message: 'Unable to Remove Notification Of Comment!', code: 502, err });
                    }
                })
            }
            else {
                return res.status(200).json({ message: 'Unable to Delete Comment!', code: 201 });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable to Delete Comment!', code: 400, err })
    }
}

export const getUserPosts = async (req, res) => {

    const userId = req.params.userId;

    try {

        const query = `SELECT * FROM allposts WHERE postUserUserId = '${userId}';`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable To fetch user Posts!', code: 404, err });

            if (Array.from(result).length > 0) {
                return res.status(200).json({ message: 'All Posts Are Featched!', code: 200, result });
            }
            else {
                return res.status(200).json({ message: 'Post Are not Available for this user!', code: 200, result: [] });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable To fetch user Posts!', code: 404, err });
    }
}

export const getUserReels = async (req, res) => {

    const userId = req.params.userId;

    try {

        const query = `SELECT * FROM allposts WHERE postUserUserId = '${userId}' and postType = 'video';`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable To fetch user Reels!', code: 404, err });

            if (Array.from(result).length > 0) {
                return res.status(200).json({ message: 'All Reels Are Featched!', code: 200, result });
            }
            else {
                return res.status(200).json({ message: 'Reels Are not Available for this user!', code: 200, result: [] });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable To fetch user Reels!', code: 404, err });
    }
}

export const getUserSavedPosts = async (req, res) => {

    const userId = req.params.userId;

    try {

        const query = `SELECT * FROM savedposts WHERE userId = '${userId}';`

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Unable to featch User Saved Posts!', code: 500, err });

            if (Array.from(result).length > 0) {
                return res.status(200).json({ message: 'All Saved Posts are Featched!', code: 200, result });
            }
            else {
                return res.status(200).json({ message: 'User are not Saved posts!', code: 201, result: [] });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Unable to featch User Saved Posts!', code: 500, err });
    }
}

export const getTaggedPost = async (req, res) => {

    const authUserId = req.params.userId;

    try {
        const query = `SELECT * FROM allposts;`

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Enable to featch Posts!', code: 400, err });

            if (Array.from(result).length > 1) {

                const ourTaggedPosts = result.filter((post, i) => {

                    const taggedUsers = JSON.parse(post.postTagList).filter((users, i) => {
                        if(users.userId === authUserId) return users;
                    });

                    if(taggedUsers.length > 0) return post
                })

                return res.status(200).json({ message: 'All Posts are Featched!', code: 200, result: ourTaggedPosts });
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