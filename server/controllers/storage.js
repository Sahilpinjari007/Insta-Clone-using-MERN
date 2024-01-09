import multer from 'multer'
import { v4 } from "uuid";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



let fileName = '';

// creating storage buket
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'storage/'),
    filename: (req, file, cb) => {
        cb(null, `${fileName}${path.extname(file.originalname)}`);
    }
})

let upload = multer({
    storage,
    limit: { fileSize: 1000000 * 100 }

}).single('myfile');



export const uploadPostImg = async (req, res) => {

    fileName = v4();

    upload(req, res, async (err) => {
        if (!req.file) {
            return res.status(500).json({ message: 'Media not Availble', code: 400 });
        }

        if (err) {
            return res.status(500).json({ message: 'Media not Availble', code: 500, err: err.message });
        }

        return res.status(200).json({ message: 'Media Uploaded!', code: 200,  url: `http://localhost:5000/storage/${fileName}${path.extname(req.file.originalname)}` })
    })
}

export const getDataFromStorage = async (req, res) =>{
    const url = path.join(__dirname, `../storage/${req.params.fileName}`)
    res.sendFile(url)
}