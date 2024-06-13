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
import { Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Chapter } from '@prisma/client'
import { Editor } from '@/components/editor'
import { Preview } from '@/components/preview'

interface ChapterDescriptionFormProps{
    initialData:Chapter
    courseId:string
    chapterId:string
}

const formSchema = z.object({
    description: z.string().min(2),
  })

  
export const ChapterDescriptionForm = ({chapterId,initialData,courseId}:ChapterDescriptionFormProps) => {
    const router=useRouter()

    const [isEditting,setIsEditing]=useState(false)
    const toggleEdit=()=>{
        setIsEditing(current=>!current)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          description: initialData?.description || "",
        },
      })

      const {isSubmitting,isValid}=form.formState
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
           const resp= await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values)
           console.log(resp)
            toast.success("Chapter Updated")
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error("Something Went Wrong")
            
        }
      }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Chapter Description
            <Button onClick={toggleEdit}  variant="ghost">
                
                {isEditting ? "Cancel":
                (<>
                <Pencil className="h-4 w-4 mr-2"/>
                 Edit Description</>
                )
               }
            </Button>
        </div>
        {
            !isEditting &&(
                <div className={cn("text-sm mt-2",
                !initialData.description && "text-slate-500 italic"
                )}>
                    {!initialData.description && "No description"}
                    {
                      initialData.description && (
                        <Preview
                        value={initialData.description}/>
                      )
                    }
                </div>
            )
        }
        {
            isEditting &&(
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Editor {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-x-2">
                  <Button 
                  disabled={isSubmitting || !isValid}
                  type="submit">Submit</Button>

                  </div>
                </form>
              </Form>
            )
        }
    </div>
  )
}
