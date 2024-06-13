'use client'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CourseModal() {
  const [isMounted , setIsmounted]=useState(false)
  useEffect(()=>{
    setIsmounted(true)
  },[])
  if(!isMounted) return
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Create course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
          <DialogDescription>
            You can create a course manually or generate using ai
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/teacher/courses">Create Manually</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/autogen">Generate with ai</Link>
          </Button>
          
        </div>
        
      </DialogContent>
    </Dialog>
  );
}
