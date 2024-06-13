import { Course, Attachment } from '@prisma/client';
import { NextResponse } from "next/server"
import db from '@/lib/db';
import { getUserId } from '@/lib/get-userId';

export async function DELETE(req:Request,{params}:{params:{courseId:string,attachmentId:string }}) {

    try {
        const userId=await getUserId()
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})

        }

        const courseOwner=await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            }
        })

        if(!courseOwner){
            return new NextResponse("Unauthorized",{status:401})

        }
        const attachment=await db.attachment.delete({
            where:{
                courseId:params.courseId,
                id:params.attachmentId
            }
        })
        return NextResponse.json(attachment)
    } catch (error) {
        console.log("ATTACHMENT_ID",error)
        return new NextResponse("internal server error",{status:500})
        
    }
    
}