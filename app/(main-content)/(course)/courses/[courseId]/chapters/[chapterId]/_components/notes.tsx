'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BookmarkPlus } from 'lucide-react';
import { Chapter, Note } from '@prisma/client';
import { NotesForm } from './edit-notes';

interface Props {
  initialData: Note | null;  // Allow initialData to be null
  chapterId: string;
  chapter: Chapter;
}

export const Notes = ({ initialData, chapterId, chapter }: Props) => {
  return (
    <div className="ml-4">
      <Sheet>
        <SheetTrigger>
          <Button variant="secondary">
            Add/Edit Chapter Notes
            <BookmarkPlus />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <NotesForm initialData={initialData} chapterId={chapterId} chapterTitle={chapter.title} />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
