import { conn } from "../DB.js";
import { v4 } from "uuid";
import bcrypt from 'bcryptjs'



export const signIn = async (req, res) => {

    const data = req.body;

    // first checking authCredential is valid or not
    try {
        let query = `SELECT * FROM USERS WHERE authCrendential = '${data.authCrendential}'`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: "SignIn Faild!", err });

            // it mens authCredential is valid
            if (Array.from(result).length >= 1) {

                // cheking password is correct or not
                bcrypt.compare(data.password, result[0].password, (err, passResult) => {
                    if (err) return res.status(500).json({ message: "SignIn Faild!", err });

                    else {
                        if (passResult) {
                            res.status(200).json({ massage: "SignIn Complete!", result })
                        } else {
                            return res.status(400).json({ message: "AuthCrendetial is Invalid! try agin", code: 401 });
                        }
                    }
                });
            }
            else {
                return res.status(400).json({ message: "AuthCrendetial is Invalid! try agin", code: 401 });
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", err });
    }
}

export const signUp = async (req, res) => {

    let data = req.body;

    // first checking user are exist or not
    try {

        let query = `SELECT * FROM USERS WHERE authCrendential = '${data.authCrendential}'`;

        conn.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: "SignUp Faild!", err });

            // it mens user are exists
            if (Array.from(result).length >= 1) {
                return res.status(400).json({ message: "User already exists!", code: 401 });
            }

            // it mens user are not exists checking username
            else {
                query = `SELECT * FROM USERS WHERE userName = '${data.userName}';`

                conn.query(query, async (err, result) => {
                    if (err) return res.status(500).json({ message: "SignUp Faild!", err });

                    // it mens username already exists
                    if (Array.from(result).length >= 1) {
                        return res.status(400).json({ message: "userName already exists! please try another", code: 401 });
                    }

                    // it mens user name not exists insert user in db
                    else {

                        const uniqueId = v4();
                        const hash_password = await bcrypt.hash(data.password, 10);
                        query = `INSERT INTO USERS (userId, authCrendential, fullName, userName, password) VALUES ('${uniqueId}', '${data.authCrendential}', '${data.fullName}', '${data.userName}', '${hash_password}');`

                        conn.query(query, (err, result) => {
                            if (err) return res.status(500).json({ message: "SignUp Faild!", err });

                            if (result.affectedRows == 1) {
                                data.id = uniqueId;
                                return res.status(200).json({ massage: "SignUp Complete!", result: { ...data, password: hash_password } })
                            }
                            else return res.status(500).json({ message: "SignUp Faild!", err });
                        })
                    }
                })
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

