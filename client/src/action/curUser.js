import * as api from '../api/Api.js'


export const getUser = async (userId) => {
    try {
        const { data } = await api.getUser(userId);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const updateProfileImg = async (formData) => {
    try {
        const { data } = api.profileImgUpdate(formData);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const updateProfile = async (formData) => {
    try {

        const { data } = await api.updateProfile(formData);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const getUserByUserName = async (userName) => {
    try {
        const { data } = await api.getUserByUserName(userName);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const followUser = async (formData) => {
    try {
        const { data } = await api.followUser(formData);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const unfollowUser = async (formData) => {
    try {
        const { data } = await api.unfollowUser(formData);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const checkUserFollowed = async (formData) => {
    try {
        const { data } = await api.checkUserFollowed(formData);
        return data;
    } catch (err) {
        return err?.response?.data;
    }
}

export const getUserFollowers = async (formData) => {
    try {
        const { data } = await api.getUserFollowers(formData);
        return data;
    } catch (err) {
        return err?.response?.data;
    }
}

export const getUserFollowings = async (formData) => {
    try {
        const { data } = await api.getUserFollowings(formData);
        return data;
    } catch (err) {
        return err?.response?.data;
    }
}

export const searchUsers = async (query) => {
    try {
        const { data } = await api.searchUsers(query);
        return data;
    } catch (err) {
        return err?.response?.data;
    }
}