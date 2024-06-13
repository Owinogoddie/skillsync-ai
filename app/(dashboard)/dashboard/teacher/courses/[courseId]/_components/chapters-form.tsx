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
import { Loader2, Pencil, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { ChaptersList } from './chapters-list'

interface ChaptersFormProps{
    initialData:any,
    courseId:string
}

const formSchema = z.object({
    title: z.string().min(2),
  })

  
export const ChaptersForm = ({initialData,courseId}:ChaptersFormProps) => {
    const router=useRouter()

    const [isUpdating,setIsUpdating]=useState(false)
    const [isCreating,setIsCreating]=useState(false)
    const toggleCreating=()=>{
        setIsCreating(current=>!current)
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
           const resp= await axios.post(`/api/courses/${courseId}/chapters`,values)
           console.log(resp)
            toast.success("Chapter Updated")
            toggleCreating()
            router.refresh()
        } catch (error) {
            toast.error("Something Went Wrong")
            
        }
      }

      const onReorder=async(updateData:{id:string;position:number})=>{
        try {
          setIsUpdating(true)
          await axios.put(`/api/courses/${courseId}/chapters/reorder`,{
            list:updateData
          })
          toast.success("Chapters reorderd")
          router.refresh()
          
        } catch (error) {
          toast.error("Something went wrong")
          
        }
        finally{
          setIsUpdating(false)
        }
      }

      const onEdit=(id:string)=>{
        router.push(`/dashboard/teacher/courses/${courseId}/chapters/${id}`)

      }
  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
        
        {
          isUpdating&&(
            <div className="h-full absolute w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-sky-700 animate-spin"/>

            </div>
          )
        }
        <div className="font-medium flex items-center justify-between">
            Course Chapters
            <Button onClick={toggleCreating}  variant="ghost">
                
                {isCreating ? "Cancel":
                (<>
                <PlusCircle className="h-4 w-4 mr-2"/>
                 Add a chapter</>
                )
               }
            </Button>
        </div>
       
        {
            isCreating &&(
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
                          placeholder="e.g 'Introduction to...'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                  disabled={isSubmitting || !isValid}
                  type="submit">Create</Button>

                </form>
              </Form>
            )
        }

        {!isCreating&&(
          <div className={cn("text-sm mt-2",!initialData.chapters.length&&"text-slate-500 italic")}>
            {!initialData.chapters.length&&"No chapters"}

          <ChaptersList
          onEdit={onEdit}
          // eslint-disable-next-line
          onReorder={onReorder}
          items={initialData.chapters || []}
          />
          </div>
        )}
        {!isCreating&&(
          <p className="text-xs text-muted-foreground">
           Drag and drop to reorder chapters
          </p>
        )}
    </div>
  )
}
