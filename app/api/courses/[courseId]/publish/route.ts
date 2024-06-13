import db from "@/lib/db";
import { getUserId } from "@/lib/get-userId";

import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.imageUrl ||
      !course.description ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse, { status: 200 });
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
