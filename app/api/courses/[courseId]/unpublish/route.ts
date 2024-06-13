import db from "@/lib/db"
import { getUserId } from "@/lib/get-userId";
import { NextResponse } from "next/server"

export async function PATCH(req:Request,{params}:{params:{courseId:string}}) {
    try {
        const  userId  = await getUserId();
        
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const course= await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            }
        })
        if(!course){
            return new NextResponse("Not found",{status:404})
        }


        const unPublishedCourse=await db.course.update({
            where:{
                id:params.courseId
            },
            data:{
                isPublished:false
            }
        })
        
        return  NextResponse.json(unPublishedCourse,{status:200})
        
    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH]",error)
        return new NextResponse("Internal server error",{status:500})
        
    }
}