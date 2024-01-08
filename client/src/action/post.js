import * as api from '../api/Api.js'


export const getPosts = async () => {

    try {
        const { data } = await api.getPosts()
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const createPost = async (formData) => {

    try {
        const { data } = await api.createPost(formData)
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const likePost = async (formData) => {

    try {
        const { data } = await api.likePost(formData);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const checkPostLiked = async (formData) => {

    try {
        const { data } = await api.checkPostLiked(formData);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const fetchPostLikedUsers = async (formData) => {
    try {
        const { data } = await api.fetchPostLikedUsers(formData);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const savePost = async (formData) => {
    try {
        const { data } = await api.savePost(formData);
        return data;
    } 
    catch (err) {
        return err?.response?.data;
    }
}

export const checkPostSaved = async (formData) =>{
    try {
        const { data } = await api.checkPostSaved(formData);
        return data;
    } 
    catch (err) {
        return err?.response?.data;
    }
}

export const commentOnPost = async (formData) =>{
    try {
        const { data } = await api.insertComment(formData);
        return data;
    } 
    catch (err) {
        return err?.response?.data;
    }
}

export const getPostComments = async (postId) =>{
    try {
        const { data } = await api.getPostComments(postId);
        return data;
    } 
    catch (err) {
        return err?.response?.data;
    }
}

