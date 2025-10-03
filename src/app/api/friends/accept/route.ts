import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const { requesterId } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();

    const me = await User.findById((session.user as any).id);
    const other = await User.findById(requesterId);
    if (!me || !other)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // remove from my friendRequests
    me.friendRequests = me.friendRequests.filter(
      (id: any) => id.toString() !== requesterId
    );
    // add to friends list (both sides)
    me.friends.push(other._id as Types.ObjectId);
other.friends.push(me._id as Types.ObjectId);

    await me.save();
    await other.save();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
