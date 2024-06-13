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
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Course } from '@prisma/client'
import Image from 'next/image'
import { FileUpload } from '@/components/file-upload'
// import { FileUpload } from '@/components/file-upload'

interface ImageFormProps{
    initialData:Course;
    courseId:string
}

const formSchema = z.object({
    imageUrl: z.string().min(2, {
      message: "Image is required.",
    }),
  })

  
export const ImageForm = ({initialData,courseId}:ImageFormProps) => {
    const router=useRouter()

    const [isEditting,setIsEditing]=useState(false)
    const toggleEdit=()=>{
        setIsEditing(current=>!current)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          imageUrl: initialData?.imageUrl || "",
        },
      })

      const {isSubmitting,isValid}=form.formState
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
           const resp= await axios.patch(`/api/courses/${courseId}`,values)
           console.log(resp)
            toast.success("Course Updated")
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error("Something Went Wrong")
            
        }
      }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Course Image
            <Button onClick={toggleEdit}  variant="ghost">
                
                {isEditting &&  <>Cancel</>}
                {!isEditting && !initialData.imageUrl &&(
                  <>
                  <PlusCircle className="h-4 w-4 mr-2"/>
                  Add an image
                  </>
                )}
                {
                  !isEditting && initialData.imageUrl &&(
                    <>
                    <Pencil className="h-4 w-4 mr-2"/>
                 Edit Image</>
                    
                  )
               }
            </Button>
        </div>
        {
            !isEditting &&(
              !initialData.imageUrl?(
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                  <ImageIcon
                  className="h-10 w-10 text-slate-500"
                  />

                </div>
                
              ):(
                <div className="relative aspect-video mt-2">
                  <Image fill alt="upload" className="object-cover rounded-md" src={initialData.imageUrl}/>
                </div>
              )
                
            )
        }
        {
            isEditting &&(
                <div>
                  Image input
                  <FileUpload/>
                  {/* endpoint="courseImage"
                  onChange={(url)=>{
                    if(url){
                      onSubmit({imageUrl:url})
                    }
                  }}
                  /> */}
                  <div className="text-xs text-muted-foreground mt-4">
                    16:9 aspect ratio recommended
                  </div>
                </div>
            )
        }
    </div>
  )
}
