"use client";
import { Chapter } from "@prisma/client";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Badge, Grid, Grip, Pencil } from "lucide-react";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number; }[]) => void;
  onEdit: (id: string) => void;
}
export const ChaptersList = ({
  items,
  onReorder,
  onEdit,
}: ChaptersListProps) => {
  const [isMounted, setsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);

    const bulkUpdate = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdate);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  // eslint-disable-next-line
                  <div
                    className={cn(
                      "flex items-center gap-x-2 my-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md text-sm",
                      chapter.isPublished &&
                        "bg-sky-300 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3  border-r border-r-slate-200 hover:bg-slate-300 rounded-md transition",
                        chapter.isPublished &&
                          "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto flex pr-2 items-center gap-x-2">
                      {chapter.isFree && (
                        <div className="px-3 py-1 border rounded-full bg-black text-slate-200">
                          Free
                        </div>
                      )}
                      <div
                        className={cn(
                          "bg-slate-500 py-1 px-3 rounded-full",
                          chapter.isPublished && "bg-sky-500"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </div>
                      <Pencil
                        onClick={() => onEdit(chapter.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
