"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chapter } from "@prisma/client";

interface Unit {
  id: string;
  name: string;
  chapters: Chapter[];
}

interface ChaptersFormProps {
  initialData: {
    units: Unit[];
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(2),
  unitId: z.string().min(1),
});

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleCreating = () => setIsCreating((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      unitId: initialData.units[0]?.id || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter Created");
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  }

  const onReorder = async (
    unitId: string,
    updateData: { id: string; position: number }[]
  ) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });
      toast.success("Chapters reordered");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/dashboard/teacher/courses/${courseId}/chapters/${id}`);
  };

  const getRequiredFields = (chapterId: string): boolean => {
    for (const unit of initialData.units) {
      const chapter = unit.chapters.find((chapter) => chapter.id === chapterId);
      if (chapter) {
        return [
          chapter.title,
          chapter.description,
          chapter.videoUrl || chapter.videoId,
        ].every(Boolean);
      }
    }
    return false;
  };
  const handlePublish = async (chapterId: string, isPublished: boolean) => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
        toast.success("Chapter unpublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
        toast.success("Chapter published");
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      {isLoading &&(
        <div className="absolute inset-0 bg-slate-500/20 rounded-md flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
      )}
      {isUpdating && (
        <div className="absolute inset-0 bg-slate-500/20 rounded-md flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course Units and Chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g 'Introduction to...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a unit"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {initialData.units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting || !isValid} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div className="mt-4">
          {initialData.units.map((unit) => (
            <div key={unit.id} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{unit.name}</h3>
              <div
                className={cn(
                  "text-sm",
                  !unit.chapters.length && "text-slate-500 italic"
                )}
              >
                {!unit.chapters.length && "No chapters in this unit"}
                <ChaptersList
                  onEdit={onEdit}
                  onReorder={(updateData) => onReorder(unit.id, updateData)}
                  items={unit.chapters}
                  onPublish={handlePublish}
                  getRequiredFields={getRequiredFields}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder chapters within each unit
        </p>
      )}
    </div>
  );
};
