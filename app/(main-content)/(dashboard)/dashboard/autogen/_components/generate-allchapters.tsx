"use client";
import React, { useState } from "react";
import axios from "axios";
import { Chapter, Unit, Course } from "@prisma/client"; // Adjust the import path based on your project structure

// Define the component props type
interface CourseProps {
  course: Course & { units: (Unit & { chapters: Chapter[] })[] };
}

// Define the status type
type ChapterStatus = "pending" | "completed" | "failed";

export const GenerateAllChapters: React.FC<CourseProps> = ({ course }) => {
  const chapters = course.units.flatMap(unit => unit.chapters);

  const initialChapterStatuses = Object.fromEntries(
    chapters.map((chapter) => [chapter.id, "pending"])
  ) as Record<string, ChapterStatus>;

  const [chapterStatuses, setChapterStatuses] = useState<Record<string, ChapterStatus>>(initialChapterStatuses);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChapterCompletion = (id: string, status: ChapterStatus) => {
    console.log(`Client ID ${id} has been hit`);
    setChapterStatuses((prevStatuses) => ({ ...prevStatuses, [id]: status }));
  };

  const submitChapters = async () => {
    setIsSubmitting(true);
    // Get all chapter IDs
    const chapterIds = chapters.map(chapter => chapter.id);
    const pendingTaskIds = chapterIds.filter(
        (id) => chapterStatuses[id] !== "completed"
      );

    const promises = pendingTaskIds.map((id) =>
      axios
        .post(`/api/generate-courses/chapters`, { id })
        .then(() => handleChapterCompletion(id, "completed"))
        .catch((error) => {
          console.error(`Chapter ${id} failed: `, error);
          handleChapterCompletion(id, "failed");
        })
    );

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error("Error submitting chapters: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allChaptersCompleted = chapters.every(
    (chapter) => chapterStatuses[chapter.id] === "completed"
  );

  return (
    <div className="bg-slate-300 w-full max-w-2xl mx-auto p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{course.title}</h2>
      {course.units.map((unit, unitIndex) => (
        <div key={unit.id} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Unit {unitIndex + 1}: {unit.name}</h3>
          <ul className="space-y-2">
            {unit.chapters.map((chapter, chapterIndex) => (
              <li
                key={chapter.id}
                className={`p-4 bg-white rounded-lg shadow-sm border ${
                  chapterStatuses[chapter.id] === "completed" ? "border-green-500 text-green-500" : "border-gray-300 text-gray-900"
                }`}
              >
                Chapter {chapterIndex + 1}: {chapter.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="mt-6">
        {allChaptersCompleted ? (
          <button className="w-full p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
            Go ahead
          </button>
        ) : (
          <button
            onClick={submitChapters}
            disabled={isSubmitting}
            className={`w-full p-3 text-white rounded-lg shadow-md transition ${
              isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};
