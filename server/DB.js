import mySql from "mysql";


export const conn = mySql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "insta"
})


export const connectDB = () => {
    conn.connect((err) => {
        if (err) return console.log("Error in Connecting to DB!");
        return console.log("Connected to MySql!");
    })
}

