import { getUserId } from "@/lib/get-userId";
import { redirect } from "next/navigation";
import { BookmarkCheck, File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { GenerateSummary } from "./_components/generate-summary-and-qns";
import { Notes } from "./_components/notes";
import db from "@/lib/db";
import QuizCards from "./_components/quiz-cards";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const userId = await getUserId();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  const chapterwithqns = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
    },
    include: {
      questions: true,
    },
  });
  const note = await db.note.findUnique({
    where: {
      userId_chapterId: {
        userId,
        chapterId: params.chapterId,
      },
    },
  });

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20 pt-2">
        <Notes initialData={note} chapterId={chapter.id} chapter={chapter} />
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            videoId={chapter.videoId}
            videoUrl={chapter.videoUrl}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            isCompleted={!!userProgress?.isCompleted}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <>
                <CourseProgressButton
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
                <GenerateSummary chapterId={params.chapterId} />
              </>
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price ?? 0}
              />
            )}
          </div>
          <Separator />
          <div className=" p-3">
            {chapter.summary ? (
              <>
                <h2>Chapter Summary</h2>
                <p className="text-muted-foreground text-xs">
                  {chapter.summary!}
                </p>
              </>
            ) : (
              <>
                <h2>Chapter description</h2>
                <p className="text-muted-foreground">{chapter.description!}</p>
              </>
            )}

            {chapterwithqns &&
              chapterwithqns.questions &&
              chapterwithqns.questions.length > 0 && (
                <QuizCards chapter={chapterwithqns} />
              )}
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
