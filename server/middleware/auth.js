
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const authUser = async(req , res, next)=>{
    try {
        const token = req.headers.token;        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);        
        const user = await User.findById(decoded.id).select("-password");        
        if(!user){
            return res.status(500).json({
                success : false,
                message : "User not found..."
            })
        }

        req.user=user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message : error.message
        })
    }
}