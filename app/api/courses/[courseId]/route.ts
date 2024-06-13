import db from "@/lib/db"
import { getUserId } from "@/lib/get-userId";
import { NextResponse } from "next/server"


    export async function DELETE(
        req: Request,
        { params }: { params: { courseId: string } }
      ) {
        try {
          const  userId  = await getUserId();
      
          if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
          }
      
          const course = await db.course.findUnique({
            where: {
              id: params.courseId,
              userId: userId,
            },
            include: {
              chapters: {
                include: {
                  muxData: true,
                }
              }
            }
          });
      
          if (!course) {
            return new NextResponse("Not found", { status: 404 });
          }
      
         
          const deletedCourse = await db.course.delete({
            where: {
              id: params.courseId,
            },
          });
      
          return NextResponse.json(deletedCourse);
        } catch (error) {
          console.log("[COURSE_ID_DELETE]", error);
          return new NextResponse("Internal Error", { status: 500 });
        }
      }

export async function PATCH(req:Request,{params}:{params:{courseId:string}}) {
    try {
        const  userId  = await getUserId();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const values=await req.json()
        const course=await db.course.update({
            where:{
                id:params.courseId,
                userId
            },
            data:{
                ... values,
            }
        })
        return  NextResponse.json(course,{status:200})
        
    } catch (error) {
        console.log("COURSE_ID",error)
        return new NextResponse("Internal Server Error",{status:500})
        
    }
    
}