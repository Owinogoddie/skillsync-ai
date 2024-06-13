import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CourseFormState {
  data: {
    title: string | null;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    categoryId: string | null;
  };
  completionText: string;
  updateField: (field: string, value: string | number) => void;
}

const calculateCompletionText = (data: CourseFormState['data']) => {
  const completedFields = Object.values(data).filter(Boolean).length;
  const totalFields = Object.keys(data).length;
  return `(${completedFields} / ${totalFields})`;
};

export const useCourseFormState = create(
  persist <CourseFormState>(
    (set, get) => ({
      data: {
        title: '',
        description: '',
        imageUrl: '',
        price: 0,
        categoryId: '',
      },
      completionText: calculateCompletionText({
        title: '', // Empty initial values for data object
        description: '',
        imageUrl: '',
        price: null,
        categoryId: '',
      }),
      updateField: (field: string, value: string | number) => {
        const currentData = get().data;
        const updatedData = {
          ...currentData,
          [field]: value,
        };

        set({
          data: updatedData,
          completionText: calculateCompletionText(updatedData),
        });
      },
    }),
    {
      name: 'course-form-state', // Specify a storage name
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage
    }
  )
);
