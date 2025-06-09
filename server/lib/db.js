import mongoose from "mongoose";


const connectDB = async ()=>{
    main().then((req,res)=>{
        console.log("Database connected successfully");
        
    }).catch(err => console.log(err));

    async function main() {
        await mongoose.connect('mongodb://127.0.0.1:27017/chatapp');
    }
}


export default connectDB