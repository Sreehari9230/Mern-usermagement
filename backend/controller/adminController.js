import userrModel from "../model/userModel.js";
import bcrypt from 'bcrypt'
import { body, validationResult } from "express-validator"
import jwt from "jsonwebtoken";


const generateAccessToken = async (user) => {
    try {
        // Pass a plain object with only the necessary fields, like _id and email
        const payload = { id: user._id, email: user.email };
        return jwt.sign(payload, "my_access_key", { expiresIn: '2h' });
    } catch (error) {
        console.error("Error during token generation: ", error.message);
        throw new Error("Token generation failed");
    }
};


const adminLogin = async (req, res) => {
    try {
        const errors = validationResult(req);
        console.log(errors.array());
        if (!errors.isEmpty()) {
            return res.status(200).json({ success: false, message: "Error occurred in validation" });
        }

        const { email, password } = req.body;
        console.log(req.body);

        const admin = await userrModel.findOne({ email });

        console.log(admin);

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const validPass = await bcrypt.compare(password, admin.password);

        if (!validPass || !admin) {
            return res.status(200).json({ success: false, message: "Invalid email or password" });
        }

        if (!admin.isVerified) {
            return res.status(200).json({ success: false, message: "Admin email is not verified" });
        }

        if (!admin.isAdmin) {
            return res.status(200).json({ success: false, message: "You have no access" });
        }

        const accessToken = await generateAccessToken(admin);  // Pass the correct object here
        console.log(accessToken, "token is here");

        return res.status(200).json({ success: true, message: "Login success", accessToken });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error occurred" });
    }
};


const userDisplay = async (req, res) => {

    try {
        const userData = await userrModel.find({})
        if (userData) {
            return res.status(200).json({ success: true, message: "user data found", user: userData })
        }
    } catch (error) {

    }
}

const DeleteUser = async (req, res) => {
    try {
        const userId = req.params.userId
        console.log("userid getting", userId)
        const deleteuser = await userrModel.findByIdAndDelete({ _id: userId });

        if (deleteuser) {
            return res.status(200).json({ success: true, message: "deleted successfully" })
        } else {
            return res.status(404).json({ success: false, message: "user not found" })
        }
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: "servere error occured" })
    }
}
export { adminLogin, userDisplay, DeleteUser }
