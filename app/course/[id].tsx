import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { useCourseStore } from '../../store/courseStore';

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const getCourseById = useCourseStore(state => state.getCourseById);
  const toggleBookmark = useCourseStore(state => state.toggleBookmark);
  const enrollCourse = useCourseStore(state => state.enrollCourse);
  
  const courseId = parseInt(id);
  const course = getCourseById(courseId);

  // If course is not found (e.g. deep link without hydration), we might need to fetch.
  // For now, we assume store is hydrated or we redirect/show error.
  
  if (!course) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Course not found</Text>
        <Button title="Go Back" onPress={() => router.back()} className="mt-4" variant="secondary"/>
      </SafeAreaView>
    );
  }

  const handleEnroll = () => {
    enrollCourse(course.id);
    // Navigate to WebView content
    router.push(`/course/${course.id}/learn`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ 
          title: 'Course Details',
          headerBackTitle: 'Back',
          headerTintColor: '#000',
       }} />
      <ScrollView className="flex-1" bounces={false}>
        <Image
          source={{ uri: course.thumbnail }}
          className="w-full h-60"
          contentFit="cover"
        />
        
        <View className="p-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-gray-900 leading-tight">
                {course.title}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleBookmark(course.id)}>
              <Ionicons 
                name={course.isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={28} 
                color={course.isBookmarked ? "#2563EB" : "#9CA3AF"} 
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-6">
            <Image
              source={{ uri: course.instructor.avatar }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View>
              <Text className="text-gray-500 text-sm">Instructor</Text>
              <Text className="font-medium text-gray-900">{course.instructor.name}</Text>
            </View>
          </View>

          <View className="flex-row mb-6 space-x-4">
            <View className="bg-blue-50 px-4 py-2 rounded-lg">
                <Text className="text-blue-700 font-bold text-lg">${course.price}</Text>
            </View>
            <View className="bg-gray-100 px-4 py-2 rounded-lg flex-row items-center">
                <Ionicons name="star" size={16} color="#F59E0B" style={{ marginRight: 4 }} />
                <Text className="text-gray-700 font-bold">4.8</Text>
            </View>
             <View className="bg-gray-100 px-4 py-2 rounded-lg flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#374151" style={{ marginRight: 4 }} />
                <Text className="text-gray-700 font-bold">12h</Text>
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-900 mb-2">About this course</Text>
            <Text className="text-gray-600 leading-relaxed">
              {course.description}
              {'\n\n'}
              This comprehensive course covers everything you need to know about the subject. 
              Designed for both beginners and advanced learners, you'll gain practical skills 
              that you can apply immediately.
            </Text>
          </View>

          <Button 
            title="Enroll Now" 
            onPress={handleEnroll}
            className="w-full mb-4"
          />
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
