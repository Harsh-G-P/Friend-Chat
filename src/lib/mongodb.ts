import mongoose from "mongoose";

const MONGODB = process.env.MONGODB_URI
if (!MONGODB) {
    throw new Error("Please define MONGODB_URI in .env.local")
}

async function connectToDB(){
    if(mongoose.connection.readyState === 1){
        return mongoose
    }
    const opts = {
        bufferCommands: false
    }

    await mongoose.connect(MONGODB!,opts)
    return mongoose
}

export default connectToDB