import * as api from '../api/Api.js'


export const uploadMedia = async (media) => {

    const formdata = new FormData();
    formdata.append("myfile", media);

    const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };
    
    try {
        const response = await api.mediaUpload(requestOptions);
        return response;
    }
    catch (err) {
        return err;
    }
}

