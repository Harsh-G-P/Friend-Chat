import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDB from "@/lib/mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";
import Message from "@/models/Message";


export async function POST(req:Request){
    try {
        await connectToDB()
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }
        const {receiverId,text}= await req.json()
        if (!receiverId || !text) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }
        const msg = await Message.create({
            sender:(session.user as any).id,
            receiver:receiverId,
            text,
        })
        return NextResponse.json(msg)
    } catch (err:any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}