import db from "@/lib/db"
import { getUserId } from "@/lib/get-userId"
import { NextResponse } from "next/server"

export async function PUT(req:Request,{params}:{params:{courseId:string}}){

    try {
        const userId=await getUserId()

        const {list}=await req.json()
        if(!userId){
            return new NextResponse("Unauthorized",{status:500})
        }

        const owncourse=await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            }
        })

        if(!owncourse){
            return new NextResponse("Unauthorized",{status:500})
        }
        for(let item of list ){
            await db.chapter.update({
                where:{id:item.id},
                data:{position:item.position}
            })
        }

        return new NextResponse("Success",{status:200})
        
    } catch (error) {
        console.log("[REORDER]",error)
        return new NextResponse("Internal server error",{status:500})
        
    }
}