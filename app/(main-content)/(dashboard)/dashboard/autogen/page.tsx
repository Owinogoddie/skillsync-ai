import { InfoIcon } from 'lucide-react';
import { GenerateCourseForm } from './_components/course-generate-form';

export default function GenerateCoursePage() {
  return (
    <div className="max-w-3xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Create Your Custom Course
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Get started in a few simple steps
        </p>
      </div>

      <div className="mt-10">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <InfoIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                How it works
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Enter a course title or topic you want to learn about.</li>
                  <li>Add between 2 to 5 units for your course.</li>
                  <li>For each unit, you can optionally provide a name.</li>
                  <li>Specify the number of chapters (1-5) for each unit.</li>
                  <li>Our AI will generate a comprehensive course based on your input!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <GenerateCourseForm />
        </div>
      </div>
    </div>
  );
}