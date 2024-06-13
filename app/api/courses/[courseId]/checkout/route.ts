import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getUserId } from "@/lib/get-userId";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const userId=await getUserId()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      }
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId
        }
      }
    });

    if (existingPurchase) {
      return new NextResponse("Already enrolled", { status: 400 });
    }

    await db.purchase.create({
      data: {
        userId,
        courseId: params.courseId,
      }
    });

    return new NextResponse("Enrolled successfully", { status: 200 });
  } catch (error) {
    console.log("[FREE_ENROLLMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
