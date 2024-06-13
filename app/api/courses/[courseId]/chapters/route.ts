import db from "@/lib/db";
import { getUserId } from "@/lib/get-userId";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const userId = await getUserId();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const owner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!owner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newposition = lastChapter && lastChapter.position !== null ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newposition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
