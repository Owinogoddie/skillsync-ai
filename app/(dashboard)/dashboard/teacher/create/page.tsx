"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
// import axios from "axios"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
// import toast from "react-hot-toast"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required",
  }),
});

const CreatePage = () => {
  
  const { userId } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
// 
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", {...values,userId});
      router.push(`/dashboard/teacher/courses/${response.data.id}`);
      toast.success("Course created");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="max-w-3xl mx-auto flex flex-col md:items- md:justify-center h-full p-6 ">
      <h1 className="text-2xl font-semibold">Name your course</h1>
      <p className="text-sm text-slate-600">
        What would you like to name your course? Don&apos;t worry, you can
        change it later
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g 'Advanced web development'"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  What will you teach in this course?.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Link href="/">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePage;
