'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Attachment, Course } from '@prisma/client'
import Image from 'next/image'

interface AttachmentFormProps{
    initialData:Course & {attachments:Attachment[]};
    courseId:string
}

const formSchema = z.object({
    url: z.string().min(1),
  })

  
export const AttachmentForm = ({initialData,courseId}:AttachmentFormProps) => {
    const router=useRouter()

    const [isEditting,setIsEditing]=useState(false)
    const [deletingId, setDeletingId]=useState<string | null>(null)
    const toggleEdit=()=>{
        setIsEditing(current=>!current)
    }

      
      async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
           const resp= await axios.post(`/api/courses/${courseId}/attachments`,values)
            toast.success("Course Updated")
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error("Something Went Wrong")
            
        }
      }

      const onDelete=async(id:string)=>{
        try {
          setDeletingId(id)
          await axios.delete(`/api/courses/${courseId}/attachments/${id}`)

          toast.success("Attachment deleted")
          router.refresh()

        } catch (error) {
          toast.error("Something went wrong")
          
        }finally{
          setDeletingId(null)
        }
      }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Course Attachments
            <Button onClick={toggleEdit}  variant="ghost">
                
                {isEditting &&  <>Cancel</>}
                {!isEditting  &&(
                  <>
                  <PlusCircle className="h-4 w-4 mr-2"/>
                  Add a file
                  </>
                )}
                
            </Button>
        </div>
        {
            !isEditting &&(
             <>
             {initialData.attachments.length===0 &&(
              <p className="text-sm text-slate-500 italic">
                No attachments yet

              </p>
             )}
             {
              initialData.attachments.length>0 &&(
                <div className="space-y-2">
                 {initialData.attachments.map((attachment)=>(
                  <div key={attachment.id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounde-md">

                    <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                    <p className="text-xs line-clamp-1">{attachment.name}</p>

                    {
                    deletingId===attachment.id &&(
                      <div>
                        <Loader2 className=" h-4 w-4 animate-spin"/>
                      </div>
                    )
                    }
                    {
                    deletingId!==attachment.id &&(
                      <button
                      onClick={()=>onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition">
                        <X className=" h-4 w-4"/>
                      </button>
                    )
                    }

                  </div>
                 ))} 
                </div>
              )
             }
             </>
                
            )
        }
        {
            isEditting &&(
                <div>
                  file input
                  <div className="text-xs text-muted-foreground mt-4">
                    Add anything your students might need to complete your course
                  </div>
                </div>
            )
        }
    </div>
  )
}
