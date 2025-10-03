// app/api/messages/[friendId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDB from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET(
  _req: Request,
  context: { params: Promise<{ friendId: string }> }
) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const myId = (session.user as any).id;
    const { friendId } = await context.params;

    const msgs = await Message.find({
      $or: [
        { sender: myId, receiver: friendId },
        { sender: friendId, receiver: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean(); // lean = faster + plain JS objects

    return NextResponse.json({ success: true, messages: msgs });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
