"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface VideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

// Define the schema to require either videoUrl or videoId
const formSchema = z
  .object({
    videoUrl: z.string().optional(),
    videoId: z.string().optional(),
  })
  .refine((data) => data.videoUrl || data.videoId, {
    message: "Either videoUrl or videoId is required",
    path: ["videoUrl", "videoId"],
  });

// Function to check if a URL is a YouTube URL
const isYouTubeUrl = (url: string) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
};

export const ChapterVideoForm = ({
  chapterId,
  initialData,
  courseId,
}: VideoFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [useFileUpload, setUseFileUpload] = useState(true);

  const toggleEdit = () => setIsEditing((current) => !current);
  const toggleInputMethod = () => setUseFileUpload((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData?.videoUrl || "",
      videoId: initialData?.videoId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const resp = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      console.log(resp);
      toast.success("Chapter Updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              {!initialData.videoUrl && !initialData.videoId ? (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add a video
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Video
                </>
              )}
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl && !initialData.videoId ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            {initialData.videoUrl && isYouTubeUrl(initialData.videoUrl) ? (
              <iframe
                className="w-full aspect-video"
                src={initialData.videoUrl.replace("watch?v=", "embed/")}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
              ></iframe>
            ) : initialData.videoId ? (
              <iframe
                className="w-full aspect-video"
                src={`https://www.youtube.com/embed/${initialData.videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
              ></iframe>
            ) : (
              initialData.videoUrl &&
              !isYouTubeUrl(initialData.videoUrl) && (
                // <video className="w-full aspect-video" controls preload="none">
                //   <source src={initialData.videoUrl} type="video/mp4" />
                //   <track
                //     src=''
                //     kind="subtitles"
                //     srcLang="en"
                //     label="English"
                //   />
                //   Your browser does not support the video tag.
                // </video>
              <video src={initialData.videoUrl} controls className="w-full aspect-video" />
              )
            )}
          </div>
        ))}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={toggleInputMethod}
                variant="outline"
              >
                {useFileUpload
                  ? "Switch to URL input"
                  : "Switch to File Upload"}
              </Button>
            </div>
            {useFileUpload ? (
              <FileUpload />
            ) : (
              // Example for FileUpload component usage
              // <FileUpload
              //   endpoint="ChapterVideo"
              //   onChange={(url) => {
              //     if (url) {
              //       form.setValue("videoUrl", url);
              //       onSubmit({ videoUrl: url });
              //     }
              //   }}
              // />
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter video URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button disabled={!isValid || isSubmitting} type="submit">
              Save
            </Button>
          </form>
        </Form>
      )}
      {(initialData.videoUrl || initialData.videoId) && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if the
          video does not appear.
        </div>
      )}
    </div>
  );
};
