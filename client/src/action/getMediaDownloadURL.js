export const getMediaDownloadUrl = (media) => {

    const data = new FormData();
    data.append("myfile", media);

    const xhr = new XMLHttpRequest();

   xhr.onreadystatechange = (e) => {

        if (e.currentTarget.readyState === 4) {
            return JSON.parse(e.currentTarget.response);

            return response.url ? { url: response.url, message: 'media Uploaded SuccessFul!', code: 200 } :
                { url: response.url, message: 'media Uploaded UnSuccessFul!', code: 400 }
        }
    }


    xhr.open("POST", "http://localhost:5000/storage/upload");
    xhr.send(data);

}



// if (media.type === "video/mp4" || media.type === "video/x-m4v") {
//     setIsVideoMedia(true);
//     setVideoUrl(response.url);
//     setMediaType("video");
//     console.log(response.url);
// } else {
//     setIsVideoMedia(false);
//     setMediaType("img");
//     setMultiMediaPath((priVal) => [...priVal, response.url]);
// }

// setShowMediaView(true);
// setShowDisplayLoader(false);