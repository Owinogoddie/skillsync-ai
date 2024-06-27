"use client";

import { Chapter, Course, Unit } from "@prisma/client";
import React from "react";
import ChapterCard, { ChapterCardHandler } from "./chapter-card";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

export const GenerateChapters = ({ course }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const chapterRefs: Record<string, React.RefObject<ChapterCardHandler>> = {};
  course.units.forEach((unit) => {
    unit.chapters.forEach((chapter) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      chapterRefs[chapter.id] = React.useRef(null);
    });
  });
  const [completedChapters, setCompletedChapters] = React.useState<Set<String>>(
    new Set()
  );
  const totalChaptersCount = React.useMemo(() => {
    return course.units.reduce((acc, unit) => {
      return acc + unit.chapters.length;
    }, 0);
  }, [course.units]);

  const progress = (completedChapters.size / totalChaptersCount) * 100;

  return (
    <div className="w-full mt-8 space-y-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Course Progress</h2>
        <Progress value={progress} className="h-3" />
        <p className="text-sm text-gray-600 mt-2">
          {completedChapters.size} of {totalChaptersCount} chapters completed
        </p>
      </div>

      {course.units.map((unit, unitIndex) => (
        <div key={unit.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Unit {unitIndex + 1}
            </h2>
            <h3 className="mt-1 text-2xl font-semibold text-gray-900">{unit.name}</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {unit.chapters.map((chapter, chapterIndex) => (
              <ChapterCard
                completedChapters={completedChapters}
                setCompletedChapters={setCompletedChapters}
                ref={chapterRefs[chapter.id]}
                key={chapter.id}
                chapter={chapter}
                chapterIndex={chapterIndex}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between mt-8">
        <Link
          href="/dashboard/autogen"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "px-6",
          })}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        {totalChaptersCount === completedChapters.size ? (
          <Link
            className={buttonVariants({
              size: "lg",
              className: "px-6",
            })}
            href={`/dashboard/teacher/courses/${course.id}`}
          >
            Save & Continue
            <CheckCircle className="w-5 h-5 ml-2" />
          </Link>
        ) : (
          <Button
            size="lg"
            className="px-6"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              Object.values(chapterRefs).forEach((ref) => {
                ref.current?.triggerLoad();
              });
            }}
          >
            Generate
            <BookOpen className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};