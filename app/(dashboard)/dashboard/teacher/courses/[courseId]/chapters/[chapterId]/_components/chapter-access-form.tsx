'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem
} from "@/components/ui/form"
import { Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Chapter } from '@prisma/client'
import { Checkbox } from '@/components/ui/checkbox'

interface ChapterAccessFormProps{
    initialData:Chapter
    courseId:string
    chapterId:string
}

const formSchema = z.object({
    isFree: z.boolean().default(false),
  })

  
export const ChapterAccessForm = ({chapterId,initialData,courseId}:ChapterAccessFormProps) => {
    const router=useRouter()

    const [isEditting,setIsEditing]=useState(false)
    const toggleEdit=()=>{
        setIsEditing(current=>!current)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {          
          isFree:!!initialData.isFree
        },
      })

      const {isSubmitting,isValid}=form.formState
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
           const resp= await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values)
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
            Chapter Access
            <Button onClick={toggleEdit}  variant="ghost">
                
                {isEditting ? "Cancel":
                (<>
                <Pencil className="h-4 w-4 mr-2"/>
                 Edit Access</>
                )
               }
            </Button>
        </div>
        {
            !isEditting &&(
                <p className={cn("text-sm mt-2",
                !initialData.isFree && "text-slate-500 italic"
                )}>
                    {initialData.isFree ? <>This chapter is free for preview</> 
                    :<>This chapter is not free</>}
                    
                </p>
            )
        }
        {
            isEditting &&(
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                
                <FormDescription>
                  Check this checkbox if you want this chapter free for preview
                  
                </FormDescription>
              </div>
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
