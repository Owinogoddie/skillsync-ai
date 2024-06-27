import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { getUserId } from '@/lib/get-userId'
import { CourseModal } from '@/app/(landing)/_components/course-modal'


const CoursesPage = async() => {
  const userId=await getUserId()
  
   if(!userId){
      return redirect('/')
    } 

    const courses=await db.course.findMany({
      where:{
        userId
      },
      orderBy:{
        createdAt:"desc"
      }
    })
  
  return (
    <div className="p-6">
<div className="container mx-auto py-10">
<CourseModal />

      <DataTable columns={columns} data={courses} />
    </div>

    </div>
  )
}

export default CoursesPage