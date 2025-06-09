import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import 'dotenv/config';
import cloudinary from '../lib/cloudinary.js'
import bcrypt from 'bcryptjs';

const Login = async (req , res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            })
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found..."
            })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if(!isPasswordMatched){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            })
        }
        
        const token = generateToken(user._id)
        res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success:false,
            message : error.message
        })
    }
}

const SignUp = async (req , res) => {
    try {
        const {fullName, email, password, bio} = req.body;
        if(!email || !password || !fullName || !bio){
            return res.status(400).json({
                success : false,
                message : "Please fill all the fields"
            })
        }
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(500).json({
                success : false,
                message : "User already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            email,
            password: hashedPassword,
            fullName,
            bio
        });

        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



const updateProfile = async (req , res)=>{
    try {
        const {fullName, bio, profilePic} = req.body;
        const userId = req.user._id        
        if(!userId){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }
        let userData;

        if(!profilePic){
            userData = await User.findByIdAndUpdate(userId, { fullName, bio }, { new: true });
        }else{
            const upload = await cloudinary.uploader.upload(profilePic)
            userData= await User.findByIdAndUpdate(userId, {fullName, profilePic:upload.secure_url, bio}, {new: true})
        }

        res.status(200).json({
            success:true,
            message:"Profile Updated...",
            user:userData
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const checkAuth = async (req , res)=>{    
    if(!req.user) return null
    res.status(200).json({
        success:true,
        user:req.user
    })
}



export { Login, SignUp, updateProfile,  checkAuth  }