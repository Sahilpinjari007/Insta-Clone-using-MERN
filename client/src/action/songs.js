import * as api from '../api/Api.js'



export const getSongBYId = async (songId) => {

    const options = {
        method: 'GET',
        url: 'https://spotify-web2.p.rapidapi.com/tracks/',
        params: {
            ids: songId
        },
        headers: {
            'X-RapidAPI-Key': 'cbf554566cmshf7d8f49b32b93e8p1d4c0ejsnf704d7742ebe',
            'X-RapidAPI-Host': 'spotify-web2.p.rapidapi.com'
        }
    };

    try {
        const { data } = await api.getSongById(options);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}


export const searchSong = async (songPerms) => {

    const options = {
        method: 'GET',
        url: 'https://spotify-web2.p.rapidapi.com/search/',
        params: {
            q: songPerms,
            type: 'tracks',
            offset: '0',
            limit: '10',
            numberOfTopResults: '5'
        },
        headers: {
            'X-RapidAPI-Key': 'cbf554566cmshf7d8f49b32b93e8p1d4c0ejsnf704d7742ebe',
            'X-RapidAPI-Host': 'spotify-web2.p.rapidapi.com'
        }
    };

    try {
        const { data } = await api.searchSong(options);
        return data;
    }
    catch (err) {
        return err?.response?.data;
    }
}