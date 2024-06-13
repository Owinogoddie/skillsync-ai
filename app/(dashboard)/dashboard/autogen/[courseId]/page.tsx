import db from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'
import { GenerateAllChapters } from '../_components/generate-allchapters'
import { GenerateChapters } from '../_components/generate-chapters'
import { Info } from 'lucide-react'
interface PageProps{
  params:{
    courseId:string
  }
}
const GenerateChaptersPage = async({params}:PageProps) => {
  const course=await db.course.findFirst({
    where:{
      id:params.courseId
    },
    include:{
      units:{
        include:{
          chapters:true
        }
      }
    }
  })
  if(!course){
    return redirect("dashboard/autogen")
  }
  
  return (
    // <div><GenerateAllChapters course={course}/></div>
    <div className="flex flex-col items-start max-w-xl mx-auto my-16">
      <h5 className="text-sm uppercase text-seconday-foreground/60">
        Course Name
      </h5>
      <h1 className="text-5xl font-bold">{course.title}</h1>

      <div className="flex p-4 mt-5 border-none bg-secondary">
        <Info className="w-12 h-12 mr-3 text-blue-400" />
        <div>
          We generated chapters for each of your units. Look over them and then
          click the Button to confirm and continue
        </div>
      </div><GenerateChapters course={course}/></div>
  )
}

export default GenerateChaptersPage