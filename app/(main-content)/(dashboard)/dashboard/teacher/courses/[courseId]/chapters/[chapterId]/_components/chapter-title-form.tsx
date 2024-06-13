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
import { Input } from "@/components/ui/input"
import { Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface ChapterTitleFormProps{
    initialData:{
        title:string
    };
    courseId:string
    chapterId:string 
}

const formSchema = z.object({
    title: z.string().min(2),
  })

  
export const ChapterTitleForm = ({initialData,courseId,chapterId}:ChapterTitleFormProps) => {
    const router=useRouter()

    const [isEditting,setIsEditing]=useState(false)
    const toggleEdit=()=>{
        setIsEditing(current=>!current)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
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
            Chapter Title
            <Button onClick={toggleEdit}  variant="ghost">
                
                {isEditting ? "Cancel":
                (<>
                <Pencil className="h-4 w-4 mr-2"/>
                 Edit title</>
                )
               }
            </Button>
        </div>
        {
            !isEditting &&(
                <p className="text-sm mt-2">
                    {initialData.title}
                </p>
            )
        }
        {
            isEditting &&(
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                          disabled={isSubmitting}
                          placeholder="e.g 'Introduction to the course'" {...field} />
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
