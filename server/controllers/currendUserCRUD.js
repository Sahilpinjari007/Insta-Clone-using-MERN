import { conn } from "../DB.js";
import { v4 } from "uuid";



export const updateProfileImg = async (req, res) => {

    const data = req.body;
    console.log('url: ', data);

    try {
        const query = `UPDATE users SET userProfileImg='${data.profileImgUrl}' WHERE userId = '${data.userId}';`


        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: "Profile Img Update Faild!", code: 401, err });

            if (result.affectedRows >= 1) {
                return res.status(200).json({ massage: "Profile Img Updated!", code: 200 })
            }
            else {
                return res.status(500).json({ message: "Profile Img Update Faild!", code: 401, err });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: "Profile Img Update Faild!", code: 401, err });
    }
}

export const getUser = async (req, res) => {

    const data = req.params.userId;

    try {
        const query = `SELECT * FROM USERS WHERE userId = '${data}'`

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: "Faild to get User", code: 401, err });

            if (Array.from(result).length >= 1) {
                return res.status(200).json({ massage: "User Featched!", result: result[0], code: 200 });
            }
            else {
                return res.status(500).json({ message: "Faild to get User", code: 401, err });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: "Faild to get User", code: 401, err });
    }
}

export const updateProfile = async (req, res) => {

    const data = req.body;

    try {
        const query = `UPDATE users SET userGender = '${data.gender}', userBio = '${data.userBio}' WHERE userId = '${data.userId}'`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: "Profile Update Faild!", code: 401, err });

            if (result.affectedRows >= 1) {
                return res.status(200).json({ message: "Profile Updated!", code: 200 })
            }
            else {
                return res.status(500).json({ message: "Profile Update Faild!", code: 401, err });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: "Profile Update Faild!", code: 401, err });
    }
}

export const getUserByUserName = async (req, res) => {

    const userName = req.params.userName;

    try {
        const query = `SELECT * FROM USERS WHERE USERNAME = '${userName}'`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: "Unable to featch User!", code: 400, err });

            if (Array.from(result).length >= 1) {
                return res.status(200).json({ message: "User featched!", code: 200, user: result[0] });
            }
            else {
                return res.status(500).json({ message: "User Not exits!", code: 401 });
            }

        })
    }
    catch (err) {
        return res.status(500).json({ message: "Unable to featch User!", code: 400, err });
    }
}

export const addFollowe = async (req, res) => {

    const data = req.body;

    // followerId, followingId, date followingUserFollwingCount followerUserFollowerCount

    try {
        let query = `SELECT * FROM Followers WHERE followerUserId = '${data.followerUserId}' and followingUserId = '${data.followingUserId}'`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: "Unable to Follow User!", code: 500, err });

            if (Array.from(result).length >= 1) {
                return res.status(200).json({ message: "You Already Followed this User!", code: 401 });
            }
            else {

                query = `INSERT INTO Followers(followerID, followerUserId, followingUserId, timeStamp) VALUES ('${v4()}','${data.followerUserId}', '${data.followingUserId}', '${data.timeStamp}')`

                conn.query(query, (err, result) => {
                    if (err) return res.status(500).json({ message: "Unable to Follow User!", code: 500, err });

                    if (result.affectedRows >= 1) {

                        query = `UPDATE USERS SET Followers = ${data.followerUserFollowerCount + 1} WHERE userId = '${data.followerUserId}'`;

                        conn.query(query, (err, result) => {
                            if (err) return res.status(500).json({ message: "Unable to Update Follow Count User!", code: 502, err });

                            if (result.affectedRows >= 1) {

                                query = `UPDATE USERS SET Following = ${data.followingUserFollwingCount + 1} WHERE userId = '${data.followingUserId}'`;

                                conn.query(query, (err, result) => {
                                    if (err) return res.status(500).json({ message: "Unable to Update Following Count User!", code: 502, err });

                                    if (result.affectedRows >= 1) {

                                        // insert notification
                                        query = `INSERT INTO notification(notificationId, userId, notifyByUserId, message, action, isRead, TimeStamp) VALUES ('${v4()}', '${data.followerUserId}', '${data.followingUserId}', 'started following you.', 'userFollow','false','${new Date()}')`

                                        conn.query(query, (err, result) => {
                                            if (err) return res.status(500).json({ message: 'Unable to add Notification Of Follow', code: 502, err });

                                            if (result.affectedRows >= 1) {
                                                return res.status(200).json({ message: "User Followed SuccessFul!", code: 200 });
                                            }
                                            else {
                                                return res.status(500).json({ message: 'Unable to add Notification Of Follow', code: 502, err });
                                            }
                                        })
                                    }
                                    else {
                                        return res.status(500).json({ message: "Unable to Update Following Count User!", code: 502, err });
                                    }
                                })
                            }
                            else {
                                return res.status(500).json({ message: "Unable to Update Follow Count User!", code: 502, err });
                            }
                        })
                    }
                    else {
                        return res.status(500).json({ message: "Unable to Follow User!", code: 500, err });
                    }
                })
            }

        })
    }
    catch (err) {
        return res.status(500).json({ message: "Unable to Follow User!", code: 500, err });
    }
}

export const removeFollow = async (req, res) => {
    const data = req.body;

    // followerId, followingId, date followingUserFollwingCount followerUserFollowerCount

    try {
        let query = `SELECT * FROM Followers WHERE followerUserId = '${data.followerUserId}' and followingUserId = '${data.followingUserId}'`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: "Unable to UnFollow User!", code: 500, err });

            if (Array.from(result).length <= 0) {
                return res.status(200).json({ message: "You Not Followed this User!", code: 401 });
            }
            else {

                query = `DELETE FROM Followers WHERE followerID = '${result[0].followerID}'`

                conn.query(query, (err, result) => {
                    if (err) return res.status(500).json({ message: "Unable to UnFollow User!", code: 500, err });

                    if (result.affectedRows >= 1) {

                        query = `UPDATE USERS SET Followers = ${data.followerUserFollowerCount - 1} WHERE userId = '${data.followerUserId}'`;

                        conn.query(query, (err, result) => {
                            if (err) return res.status(500).json({ message: "Unable to Update Follow Count User!", code: 502, err });

                            if (result.affectedRows >= 1) {

                                query = `UPDATE USERS SET Following = ${data.followingUserFollwingCount - 1} WHERE userId = '${data.followingUserId}'`;

                                conn.query(query, (err, result) => {
                                    if (err) return res.status(500).json({ message: "Unable to Update Following Count User!", code: 502, err });

                                    if (result.affectedRows >= 1) {

                                        // delete follow notification
                                        query = `DELETE FROM notification WHERE userId='${data.followerUserId}' AND notifyByUserId='${data.followingUserId}' AND action='userFollow';`

                                        conn.query(query, (err, result) => {
                                            if (err) return res.status(500).json({ message: 'Unable to Remove Notification Of Follow!', code: 502, err });

                                            if (result.affectedRows >= 1) {
                                                return res.status(200).json({ message: "User UnFollowed SuccessFul!", code: 200 });
                                            }
                                            else {
                                                return res.status(500).json({ message: 'Unable to Remove Notification Of Follow!', code: 502, err });
                                            }
                                        })

                                    }
                                    else {
                                        return res.status(500).json({ message: "Unable to Update Following Count User!", code: 502, err });
                                    }
                                })
                            }
                            else {
                                return res.status(500).json({ message: "Unable to Update Follow Count User!", code: 502, err });
                            }
                        })
                    }
                    else {
                        return res.status(500).json({ message: "Unable to UnFollow User!", code: 500, err });
                    }
                })
            }

        })
    }
    catch (err) {
        return res.status(500).json({ message: "Unable to UnFollow User!", code: 500, err });
    }
}

export const checkUserFollowing = async (req, res) => {

    const data = req.body;


    try {
        let query = `SELECT * FROM Followers WHERE followerUserId = '${data.followerUserId}' and followingUserId = '${data.followingUserId}'`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: "Unable to Check Follow User!", code: 500, err });

            if (Array.from(result).length >= 1) {
                return res.status(200).json({ message: "You Already Followed this User!", value: true, code: 200 });
            }
            else {
                return res.status(200).json({ message: "You Not Followed this User!", value: false, code: 200 });
            }
        })
    }
    catch (err) {
        return res.status(500).json({ message: "Unable to Check Follow User!", code: 500, err });
    }
}

export const getUserFollowers = async (req, res) => {

    const data = req.body;

    try {
        const query = `SELECT * FROM Followers WHERE FollowerUserId = '${data.userId}' LIMIT ${data.userCount};`

        conn.query(query, (err, result) => {
            if (err) return res.status(200).json({ message: "Unable to Featch Followers", code: 500, err });

            if (Array.from(result).length > 0) {
                return res.status(200).json({ message: "Featched Followers", code: 200, result });
            }
            else {
                return res.status(200).json({ message: "Unable to Featch Followers", code: 401, err });
            }
        })
    }
    catch (err) {
        return res.status(200).json({ message: "Unable to Featch Followers", code: 500, err });
    }
}

export const getUserFollowering = async (req, res) => {

    const data = req.body;

    try {
        const query = `SELECT * FROM Followers WHERE FollowingUserId = '${data.userId}' LIMIT ${data.userCount};`;

        conn.query(query, (err, result) => {
            if (err) return res.status(200).json({ message: "Unable to Featch Following", code: 500, err });

            if (Array.from(result).length > 0) {
                return res.status(200).json({ message: "Featched Following", code: 200, result });
            }
            else {
                return res.status(200).json({ message: "Unable to Featch Following", code: 401, err });
            }
        })
    }
    catch (err) {
        return res.status(200).json({ message: "Unable to Featch Following", code: 500, err });
    }
}

export const getUserFollowerCount = async (req, res) => {

    const userId = req.params.userId;

    try {

        const query = `SELECT Followers FROM Users WHERE userId = '${userId}';`;

        conn.query(query, (err, res) => {
            if (err) return res.status(200).json({ message: "Unable to Featch Followers Count", code: 500, err });

            if (Array.from(result).length > 0) {
                return res.status(200).json({ message: "Featched Followers Count", code: 200, result });
            }
            else {
                return res.status(200).json({ message: "Unable to Featch Followers Count", code: 401, err });
            }
        })

    } catch (err) {
        return res.status(200).json({ message: "Unable to Featch Followers Count", code: 500, err });
    }
}

export const getUsers = async (req, res) => {

    const searchquery = req.query.searchUser;

    try {
        const query = `SELECT * FROM Users WHERE userName like '%${searchquery}%' or fullName like '%${searchquery}%'`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: "Unable to get Users", err });

            if (Array.from(result).length > 0) {
                return res.status(200).json({ message: 'Users Available', code: 200, result })
            }
            else {
                return res.status(200).json({ message: 'Users not Available', code: 201, result })
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Unable to get Users" });
    }
}

export const getNotifications = async (req, res) =>{

    const userId = req.params.userId;

    try{

        const query = `SELECT * FROM notification WHERE userId = '${userId}';`;

        conn.query(query, (err, result)=>{
            if(err) return res.status(500).json({message: 'Unable to featch Notifications!', code: 404, err});

            if(Array.from(result).length > 0){
                return res.status(200).json({message: 'Notifications are featched!', code: 200, result});
            }
            else{
                return res.status(200).json({message: 'Notifications are not Avilable!', code: 201, result: []});
            }
        })
    }
    catch(err){
        return res.status(500).json({message: 'Unable to featch Notifications!', code: 404, err});
    }
}
