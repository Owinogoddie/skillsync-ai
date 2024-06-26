import db from "@/lib/db"
import { getUserId } from "@/lib/get-userId"
import { NextResponse } from "next/server"

export async function POST(req:Request,{params}:{params:{courseId:string}}){
  
    try {
        const userId=await getUserId()
        const {url}=await req.json()

        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }

        const courseOwner= await db.course.findUnique({
            where:{
                id:params.courseId,
                userId:userId
            }
        })
        if(!courseOwner){
            return new NextResponse("Unauthorized",{status:401})

        }

        const attachment=await db.attachment.create({
            data:{
                url,
                name:url.split("/").pop(),
                courseId:params.courseId
            }
        })
        console.log(url,url.split("/").pop(),params.courseId
        )
        return  NextResponse.json(attachment,{status:200})
        
    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS",error)
        return new NextResponse("internal server error",{status:500})
        
    }

}