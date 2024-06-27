import db from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'
import { GenerateChapters } from '../_components/generate-chapters'
import { Info, BookOpen } from 'lucide-react'

interface PageProps {
  params: {
    courseId: string
  }
}

const GenerateChaptersPage = async ({ params }: PageProps) => {
  const course = await db.course.findFirst({
    where: {
      id: params.courseId
    },
    include: {
      units: {
        include: {
          chapters: true
        }
      }
    }
  })

  if (!course) {
    return redirect("/dashboard/autogen")
  }
  
  return (
    <div className="max-w-4xl mx-auto my-16 px-4">
      <div className="mb-8">
        <h5 className="text-sm uppercase text-gray-500 tracking-wide">
          Course Overview
        </h5>
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          {course.title}
        </h1>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              We&apos;ve generated chapters for each of your units. Please review them and click the button to confirm and continue.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Course Structure
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Overview of units and chapters
          </p>
        </div>
        <div className="border-t border-gray-200">
          {course.units.map((unit, unitIndex) => (
            <div key={unit.id} className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                Unit {unitIndex + 1}: {unit.name}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {unit.chapters.map((chapter, chapterIndex) => (
                    <li key={chapter.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 truncate">
                          Chapter {chapterIndex + 1}: {chapter.title}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <GenerateChapters course={course} />
      </div>
    </div>
  )
}

export default GenerateChaptersPage