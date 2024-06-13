import db from "@/lib/db";
import { getUserId } from "@/lib/get-userId";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    const { title } = body;
    if (!title) {
      return new NextResponse("Title is required", { status: 500 });
    }
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const response = await db.course.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("COURSE_POST_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
