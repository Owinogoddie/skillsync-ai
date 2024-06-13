'use client'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { BookMarked } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  chapterId:string,
}

export const GenerateSummary = ({chapterId}: Props) => {
    const [isLoading, setIsLoading]=useState(false)
    const [summary, setSummary]=useState(false)
    const onClick=async()=>{
      try {
        setIsLoading(true)
        const response=await axios.post("/api/generate-courses/summary",{chapterId})
        console.log(response.data)
        toast.success("Questions generated")
      } catch (error) {
        toast.error("Error generating questions")
        console.log(error)
      }finally{
        setIsLoading(false)
      }
    }
  return (
    <div>
         <Button
  onClick={onClick}
  disabled={isLoading}
  type="button"
  className="w-full md:w-auto"
>
  {summary ? "Regenerate qns" : "Generate Summary & Qns"}
  <BookMarked className="h-4 w-4 ml-2" />
</Button>
    </div>
  )
}