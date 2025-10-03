import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();

    const me = await User.findById((session.user as any).id)
      .populate("friends", "username name image about createdAt banner")
      .populate("friendRequests", "username name image about createdAt banner")
      .lean();

    if (!me)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    console.log("Friend requests:", me.friendRequests);
    return NextResponse.json({
      friends: me.friends || [],
      requests: me.friendRequests || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
