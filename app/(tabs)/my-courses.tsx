import React, { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Course, CourseCard } from '../../components/course/CourseCard';
import { useCourses } from '../../hooks/useCourses';
import { useCourseStore } from '../../store/courseStore';

export default function MyCoursesScreen() {
  const { loading } = useCourses(); // This hook will fetch data if store is empty
  const courses = useCourseStore((state) => state.courses);
  const enrolledCoursesIds = useCourseStore((state) => state.enrolledCourses);
  const toggleBookmark = useCourseStore((state) => state.toggleBookmark);

  const myCourses = useMemo(() => {
    return courses.filter(c => enrolledCoursesIds.includes(c.id));
  }, [courses, enrolledCoursesIds]);

  const renderItem = ({ item }: { item: Course }) => (
    <CourseCard 
      course={item} 
      onBookmark={toggleBookmark}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
      <View className="px-5 py-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">My Learning</Text>
      </View>

      <FlatList
        data={myCourses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="p-5 pb-24"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-4xl mb-4">📚</Text>
            <Text className="text-xl font-bold text-gray-900">No courses yet</Text>
            <Text className="text-gray-500 mt-2 text-center px-10">
              Enroll in a course to see it here and track your progress.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
