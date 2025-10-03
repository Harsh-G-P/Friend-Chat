import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";


export async function PUT(req:Request){
     try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        await connectToDB()
        const body = await req.json()
        const updateFields: any = {};
    ["name", "about", "banner", "image", "email", "status", "phone"].forEach(
      (key) => {
        if (body[key] !== undefined && body[key] !== null) {
          updateFields[key] = body[key];
        }
      }
    );


        const updatedUser = await User.findByIdAndUpdate(
      (session.user as any).id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}


export async function GET(req:Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json(
                {success:false,message:"Unauthorized"},
                {status:404}
            )
        }
        await connectToDB()
        const user=await User.findById((session.user as any).id).select("-password")
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, user });
    } catch (error:any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}


export async function DELETE(req:Request){
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDB();

    const deletedUser = await User.findByIdAndDelete((session.user as any).id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

}