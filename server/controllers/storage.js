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



export const uploadPostImg = async (req, resp) => {

    fileName = v4();

    upload(req, resp, async (err) => {
        // Validate request
        if (!req.file) {
            return resp.json({ error: 'File not Availble', code: 400 });
        }

        if (err) {
            return resp.status(500).send({ error: err.message, code: 500 });
        }

        return resp.json({ url: `http://localhost:5000/storage/${fileName}${path.extname(req.file.originalname)}` })
    })
}

export const getDataFromStorage = async (req, res) =>{
    const url = path.join(__dirname, `../storage/${req.params.fileName}`)
    res.sendFile(url)
}