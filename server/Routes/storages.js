import express from "express";
import { getDataFromStorage, uploadPostImg } from "../controllers/storage.js";


const router = express.Router();


router.post('/upload', uploadPostImg)
router.get('/:fileName', getDataFromStorage)

export default router;