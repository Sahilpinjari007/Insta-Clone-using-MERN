import React, { useEffect, useState } from 'react';
import Post from './Post/Post';
import './Posts.css'
import { getPosts } from '../../../../../action/post';

const Posts = () => {

    const [post, setPost] = useState([
        {
            "postId": "lahfaiafanianxzizdi",
            "postUserUserId": "",
            "postUserIsAvilableStory": true,
            "postUserName": "sk_shaikh_khaja_photography",
            "postTitle": "आम्ही तर Royal Attitude ठेवतो, पण लोकांना वाटतं आमच्या सवयी खराब आहेत....! 💯👑👿😎❤️‍🔥",
            "postUserProfileImgUrl": "/insta imgs/asset 8.jpeg",
            "postMetaData": "Pathardi Ahamadnagar",
            "postUploadTime": "1h",
            "postType": "img",
            "postVideoURL": "",
            "singlePostImgURL": "/profile imgs/asset 4.jpeg",
            "isPostContainSong": false,
            "postSongTitle": "",
            "postSongURL": "",
            "isMultiplePost": false,
            "multipleImgPostURLS": [],
            "isPostTaged": true,
            "postTagList": ["tag1-user-id", "tag2-user-id", "tag3-user-id"],
            "postComments": [],
            "postLikes": 0,
            "postLikedUsers": []

        },
        {
            "postId": "lahfaiafanianxzizdi",
            "postUserUserId": "",
            "postUserIsAvilableStory": false,
            "postUserName": "chaahatein",
            "postTitle": "Follow @wordsmatess for more ❤️ Cr:- Unknown",
            "postUserProfileImgUrl": "/insta imgs/asset 3.jpeg",
            "postMetaData": "Arijit Singh, Shreyas Puranik, Siddharth-Garima",
            "postUploadTime": "2h",
            "postType": "video",
            "postVideoURL": "/insta videos/video1.mp4",
            "singlePostImgURL": "",
            "isPostContainSong": false,
            "postSongTitle": "",
            "postSongURL": "",
            "isMultiplePost": false,
            "multipleImgPostURLS": [],
            "isPostTaged": false,
            "postTagList": [],
            "postComments": [],
            "postLikes": 0,
            "postLikedUsers": []

        },
        {
            "postId": "lahfaiafanianxzizdi",
            "postUserUserId": "",
            "postUserIsAvilableStory": false,
            "postUserName": "broken.lines.143",
            "postTitle": "🤭🌸 #loveatfirstsight #lovestatus #instavirals #viralvideos #viralreels #trendingreels",
            "postMetaData": "New York, New York",
            "postUserProfileImgUrl": "/insta imgs/asset 4.jpeg",
            "postUploadTime": "2w",
            "postType": "img",
            "postVideoURL": "",
            "singlePostImgURL": "",
            "isPostContainSong": true,
            "postSongTitle": "My Song Mp3",
            "postSongURL": "https://www.learningcontainer.com/download/sample-mp3-file/?wpdmdl=1676&amp;refresh=654246490e8851698842185",
            "isMultiplePost": true,
            "multipleImgPostURLS": ["/profile imgs/asset 4.jpeg", "/profile imgs/asset 5.jpeg", "/profile imgs/asset 6.jpeg"],
            "isPostTaged": true,
            "postTagList": [],
            "postComments": [],
            "postLikes": 0,
            "postLikedUsers": []

        }
    ]);

    const [posts, setPosts] = useState([]);

    const featchAllPosts = async () =>{

        const response = await getPosts();

        const AllPosts = response?.result?.map((elem)=>{
            console.log(JSON.parse(elem?.multipleImgPostURLS));
            elem.multipleImgPostURLS = JSON.parse(elem?.multipleImgPostURLS);
            elem.postTagList = JSON.parse(elem?.postTagList);
            return elem;
        })

        setPosts(AllPosts);
    }

    useEffect(()=>{
        featchAllPosts();
    }, []);

    return (
        <div className="main-section-data">
            {
                posts.map((elem, i) => {
                    return <Post postData={elem} key={i} />
                })
            }
        </div>
    );
}

export default Posts;
