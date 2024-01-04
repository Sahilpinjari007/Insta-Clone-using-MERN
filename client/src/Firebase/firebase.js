import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';





const firebaseConfig = {
    apiKey: "AIzaSyBT99HN_XL_o0F7aqRno-QJ-IScMBps0SM",
    authDomain: "insta-clone-b5cbe.firebaseapp.com",
    projectId: "insta-clone-b5cbe",
    storageBucket: "insta-clone-b5cbe.appspot.com",
    messagingSenderId: "190146635700",
    appId: "1:190146635700:web:56d62669c51fd87a49b4e1",
    measurementId: "G-VZX1HFEM0Z"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);