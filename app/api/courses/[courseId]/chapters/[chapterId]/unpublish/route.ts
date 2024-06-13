import db from "@/lib/db"
import { getUserId } from "@/lib/get-userId";
import { NextResponse } from "next/server"

export async function PATCH(req:Request,{params}:{params:{courseId:string,chapterId:string}}) {
    try {
        const userId = await getUserId();

        
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const ownCourse= await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            }
        })
        if(!ownCourse){
            return new NextResponse("Unauthorized",{status:401})
        }
        const chapter=await db.chapter.findUnique({
            where:{
                id:params.chapterId,
                courseId:params.courseId
            }
        })

    

        const publishedChapter=await db.chapter.update({
            where:{
                id:params.chapterId,
                courseId:params.courseId
            },
            data:{
                isPublished:false
            }
        })
        
        const publishedChapterInCourse=await db.chapter.findMany({
            where:{
                id:params.courseId
            }
        })
        if(!publishedChapterInCourse.length){
            await db.course.update({
                where:{
                    id:params.courseId
                },
                data:{
                    isPublished:false
                }
            })
        }
        return  NextResponse.json(publishedChapter,{status:200})
        
    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH]",error)
        return new NextResponse("Internal server error",{status:500})
        
    }
}