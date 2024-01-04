import React, { createContext, useEffect, useState } from "react";
import { getUser } from "../action/curUser";



export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [authUser, setAuthUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [showProfileDailog, setShowProfileDailog] = useState(false);
    const [profileUser, setProfileUser] = useState({});
    const [fromDailog, setFromDailog] = useState('');
    const [createPostDailog, setCreatePostDailog] = useState(false)
    const [aleartData, setAleartData] = useState({message: '', type: ''});
    const [isAlert, setIsAlert] = useState(false);


    const getCurrentUser = async (curUserID) => {
        const response = await getUser(curUserID);

        if (response.code === 200) {
            setAuthUser(response.result);
        }
    }

    

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('profile'));
        getCurrentUser(data?.id || data?.userId);

        setTimeout(() => setIsAlert(false), 3000);
    }, [isAlert])



    return <AppContext.Provider value={{
        authUser,
        setAuthUser,
        loading,
        setLoading,
        showProfileDailog,
        setShowProfileDailog,
        getCurrentUser,
        profileUser,
        setProfileUser, fromDailog, setFromDailog, createPostDailog, setCreatePostDailog
        ,aleartData, setAleartData, isAlert, setIsAlert
    }}>
        {children}
    </AppContext.Provider>
}