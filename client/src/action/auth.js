import * as api from '../api/Api.js'


export const signUp = async (formData) => {

    try {
        const { data } = await api.signUp(formData);
        localStorage.setItem('profile', JSON.stringify(data.result));
        localStorage.setItem('isNotnewUser', true);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}

export const signIn = async (formData) => {

    try {
        const { data } = await api.signIn(formData);
        localStorage.setItem('profile', JSON.stringify(data.result[0]));
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}