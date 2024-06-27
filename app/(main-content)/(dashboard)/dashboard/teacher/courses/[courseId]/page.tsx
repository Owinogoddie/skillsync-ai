import { IconBadge } from "@/components/icon-badge";
import { File, LayoutDashboard, ListChecks } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { Actions } from "./_components/actions";
import { Banner } from "@/components/banner";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/get-userId";
import { CategoryForm } from "./_components/category-form";
import { ImageForm } from "./_components/image-form";
import { ChaptersForm } from "./_components/chapters-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { Category } from "@prisma/client";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const userId = await getUserId();
  if (!userId) {
    return redirect("/");
  }
  
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      units: {
        include: {
          chapters: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const requiredFields = [
    { name: "Title", value: course.title },
    { name: "Description", value: course.description },
    { name: "Image", value: course.imageUrl },
    { name: "Category", value: course.categoryId },
    { name: "Chapters", value: course.chapters.some((chapter) => chapter.isPublished) },
  ];

  const completedFields = requiredFields.filter((field) => field.value).length;
  const totalFields = requiredFields.length;

  const incompletedFields = requiredFields
    .filter((field) => !field.value)
    .map((field) => field.name);

  const completionText = `${completedFields} / ${totalFields}`;
  const isCompleted = completedFields === totalFields;

  interface OptionType {
    label: string;
    value: string;
  }

  let options: OptionType[] = [];
  if (!categories || categories.length === 0) {
    console.log("No categories available.");
  } else {
    options = categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students" />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Completed fields: {completionText}
            </span>
            {!isCompleted && (
              <span className="text-sm text-red-500">
                Incomplete fields: {incompletedFields.join(", ")}
              </span>
            )}
          </div>
          <Actions
            disabled={!isCompleted}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            {options.length > 0 && (
              <CategoryForm
                initialData={course}
                courseId={course.id}
                options={options}
              />
            )}
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePage;