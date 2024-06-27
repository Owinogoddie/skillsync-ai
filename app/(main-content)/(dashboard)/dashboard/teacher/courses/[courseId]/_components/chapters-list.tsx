import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Chapter } from "@prisma/client";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
  onPublish: (id: string, isPublished: boolean) => void;
  getRequiredFields: (chapterId: string) => boolean;
}

export const ChaptersList = ({
  items,
  onReorder,
  onEdit,
  onPublish,
  getRequiredFields,
}: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

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
        {(provided: DroppableProvided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 my-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md text-sm",
                      chapter.isPublished && "bg-sky-300 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style }}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-md transition",
                        chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                      )}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto flex pr-2 items-center gap-x-2">
                      {/* {chapter.isFree && (
                        <div className="px-3 py-1 border rounded-full bg-black text-slate-200">
                          Free
                        </div>
                      )} */}
                      <button className=""  onClick={() => onEdit(chapter.id)}>View</button>
                      <button
                        onClick={() => onPublish(chapter.id, chapter.isPublished)}
                        disabled={!chapter.isPublished && !getRequiredFields(chapter.id)}
                        className={cn(
                          "py-1 px-3 rounded-full text-white",
                          chapter.isPublished
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : getRequiredFields(chapter.id)
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-300 cursor-not-allowed"
                        )}
                      >
                        {chapter.isPublished ? "Unpublish" : "Publish"}
                      </button>
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
