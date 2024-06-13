"use client";
import React, { useEffect, useState, useCallback } from "react";
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
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Note } from "@prisma/client";
import { useDebouncedCallback } from "use-debounce";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Separator } from "@/components/ui/separator";

interface NotesFormProps {
  initialData: Note | null; // Allow initialData to be null
  chapterId: string;
  chapterTitle: string;
}

const formSchema = z.object({
  content: z.string().min(2, {
    message: "Description is required.",
  }),
});

export const NotesForm = ({
  initialData,
  chapterId,
  chapterTitle,
}: NotesFormProps) => {
  const router = useRouter();
  const [isEditting, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialData?.content || "", // Use empty string if initialData is null
    },
  });

  const debouncedSubmit = useDebouncedCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        await axios.patch(`/api/notes`, { ...values, chapterId });
        toast.success("Note Updated");
        // don't toggle edit mode here, since it will reset the state
        router.refresh();
      } catch (error) {
        toast.error("Something Went Wrong");
      }
    },
    5000
  );

  useEffect(() => {
    const subscription = form.watch(() => {
      debouncedSubmit(form.getValues());
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedSubmit]);

  const handleDownloadAsText = () => {
    const content = form.getValues("content");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded as text");
  };

  const handleDownloadAsPDF = async () => {
    const content = form.getValues("content");
    const doc = new jsPDF();

    const div = document.createElement("div");
    div.innerHTML = content;
    document.body.appendChild(div);

    const canvas = await html2canvas(div, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    doc.addImage(imgData, "PNG", 10, 10, 190, 0);
    doc.save("notes.pdf");

    document.body.removeChild(div);
    toast.success("Downloaded as PDF");
  };

  const handleDownloadAsHTML = () => {
    const content = form.getValues("content");
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded as HTML");
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {chapterTitle} Notes
        <div>
          <Button onClick={toggleEdit} variant="ghost">
            {isEditting ? (
              "Cancel"
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Note
              </>
            )}
          </Button>
        </div>
      </div>
      {!isEditting && (
        <ReactQuill
          value={initialData?.content || "No Notes!! create some"}
          theme="snow"
          className="bg-white"
          readOnly
          modules={{ toolbar: false }} // Disable the toolbar
        />
      )}
      {isEditting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(debouncedSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ReactQuill
                      value={field.value}
                      onChange={field.onChange}
                      theme="snow"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
      <br />
      <Separator />
      <br />
      <Button onClick={handleDownloadAsText} variant="outline" className="ml-2">
        Download as Text
      </Button>
      <Button onClick={handleDownloadAsPDF} variant="outline" className="ml-2">
        Download as PDF
      </Button>
      <Button onClick={handleDownloadAsHTML} variant="outline" className="ml-2">
        Download as HTML
      </Button>
    </div>
  );
};
