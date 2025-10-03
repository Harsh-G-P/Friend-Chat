import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function POST(req: Request) {
    try {
        const { targetUsername } = await req.json()
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        await connectToDB()
        const senderId = new mongoose.Types.ObjectId((session.user as any).id);

        const targetUser = await User.findOne({ username: targetUsername })
        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        if ((targetUser._id as mongoose.Types.ObjectId).equals(senderId)) {
            return NextResponse.json(
                { message: "You cannot send a friend request to yourself" },
                { status: 400 }
            );
        }

        if (targetUser.friendRequests.includes(senderId) || targetUser.friends.includes(senderId)) {
            return NextResponse.json({ message: "Already requested or friends" })
        }
        targetUser.friendRequests.push(new mongoose.Types.ObjectId(senderId));
        await targetUser.save();
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}