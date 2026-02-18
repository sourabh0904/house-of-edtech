import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Course, CourseCard } from '../../components/course/CourseCard';
import { useCourses } from '../../hooks/useCourses';
import { useCourseStore } from '../../store/courseStore';

export default function HomeScreen() {
  const { courses, loading, error, refreshing, onRefresh } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const toggleBookmark = useCourseStore(state => state.toggleBookmark);

  const filteredCourses = useMemo(() => {
    if (!searchQuery) return courses;
    return courses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const renderItem = ({ item }: { item: Course }) => (
    <CourseCard 
      course={item} 
      onBookmark={toggleBookmark}
    />
  );

  if (loading && !refreshing && courses.length === 0) {
    return (
       <SafeAreaView className="flex-1 bg-white justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
       </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
      <View className="px-5 py-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Discover Courses</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-12">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search courses or instructors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {error ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <Text className="text-blue-600 font-medium" onPress={onRefresh}>Try Again</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="p-5 pb-24"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
          }
          ListEmptyComponent={
             !loading ? (
                <View className="items-center justify-center py-20">
                  <Text className="text-gray-500 text-lg">No courses found</Text>
                </View>
             ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
