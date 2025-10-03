import mongoose,{Schema,Document,Model} from "mongoose";

export interface IMessage extends Document {
    sender:mongoose.Types.ObjectId,
    receiver:mongoose.Types.ObjectId,
    text:string,
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        sender:{type:Schema.Types.ObjectId,ref:"User",required:true},
        receiver:{type:Schema.Types.ObjectId,ref:"User",required:true},
        text:{type:String,required:true},
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const Message:Model<IMessage>=mongoose.models.Message || mongoose.model<IMessage>("Message",MessageSchema)

export default Message