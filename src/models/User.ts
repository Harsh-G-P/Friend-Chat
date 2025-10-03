import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  image?: string;
  about: string;
  status: "online" | "idle" | "dnd" | "invisible";
  banner?:string,
  phone: number,
  friends: mongoose.Types.ObjectId[];
  friendRequests: mongoose.Types.ObjectId[];
  servers: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    about: { type: String, default: "" },
    status: { 
      type: String, 
      enum: ["online", "idle", "dnd", "invisible"], 
      default: "online" 
    },
    banner:{
      type:String,
      default:""
    },
    phone:{
      type:Number
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: []  }],
    servers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Server" }]
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
