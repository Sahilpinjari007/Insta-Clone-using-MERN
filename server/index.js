import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import { connectDB } from "./DB.js";
import userRoutes from './Routes/users.js'
import postRoutes from './Routes/posts.js';
import curUserRoutes from './Routes/currendUserCRUDs.js';
import storages  from './Routes/storages.js'


const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send("Hello world It is Server!")
})

app.use('/auth/user', userRoutes);
app.use('/insgaram/posts', postRoutes);
app.use('/user/operations', curUserRoutes);
app.use('/storage', storages)

app.listen(PORT,  () => {
    connectDB();
    console.log(`Server running on PORT ${PORT}`);
})