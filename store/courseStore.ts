import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Course } from '../components/course/CourseCard';

interface CourseState {
  courses: Course[];
  bookmarks: number[]; // Array of course IDs
  enrolledCourses: number[];
  setCourses: (courses: Course[]) => void;
  toggleBookmark: (courseId: number) => void;
  enrollCourse: (courseId: number) => void;
  isEnrolled: (courseId: number) => boolean;
  getCourseById: (id: number) => Course | undefined;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],
      bookmarks: [],
      enrolledCourses: [],
      setCourses: (newCourses) => {
        // preserve bookmark status
        const currentBookmarks = get().bookmarks;
        const coursesWithBookmarks = newCourses.map(c => ({
            ...c,
            isBookmarked: currentBookmarks.includes(c.id)
        }));
        set({ courses: coursesWithBookmarks });
      },
      toggleBookmark: (courseId) => {
        const { bookmarks, courses } = get();
        const isBookmarked = bookmarks.includes(courseId);
        
        let newBookmarks;
        if (isBookmarked) {
          newBookmarks = bookmarks.filter(id => id !== courseId);
        } else {
          newBookmarks = [...bookmarks, courseId];
        }

        const newCourses = courses.map(c => 
            c.id === courseId ? { ...c, isBookmarked: !isBookmarked } : c
        );

        set({ bookmarks: newBookmarks, courses: newCourses });
      },
      enrollCourse: (courseId) => {
        const { enrolledCourses } = get();
        if (!enrolledCourses.includes(courseId)) {
          set({ enrolledCourses: [...enrolledCourses, courseId] });
        }
      },
      isEnrolled: (courseId) => get().enrolledCourses.includes(courseId),
      getCourseById: (id) => get().courses.find(c => c.id === id),
    }),
    {
      name: 'course-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        bookmarks: state.bookmarks, 
        enrolledCourses: state.enrolledCourses,
        courses: state.courses 
      }), 
      // Actually we might want to persist courses too for offline cache, 
      // but for now bookmarks is the detailed requirement.
      // "Implement bookmark toggle with local storage"
    }
  )
);
