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