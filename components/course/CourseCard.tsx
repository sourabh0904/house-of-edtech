import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  instructor: {
      name: string;
      avatar: string;
  };
  isBookmarked?: boolean;
}

interface CourseCardProps {
  course: Course;
  onBookmark: (id: number) => void;
}

export const CourseCard = React.memo(function CourseCard({ course, onBookmark }: CourseCardProps) {
  return (
    <Link href={`/course/${course.id}`} asChild>
      <TouchableOpacity className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden border border-gray-100">
        <Image
          source={{ uri: course.thumbnail }}
          className="w-full h-40"
          contentFit="cover"
          transition={200}
        />
        <View className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-sm font-medium text-blue-600 mb-1 line-clamp-1">
              {course.instructor.name}
            </Text>
            <TouchableOpacity onPress={(e) => {
              e.stopPropagation();
              onBookmark(course.id);
            }}>
              <Ionicons 
                name={course.isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={course.isBookmarked ? "#2563EB" : "#9CA3AF"} 
              />
            </TouchableOpacity>
          </View>
          
          <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={2}>
            {course.title}
          </Text>
          
          <Text className="text-gray-500 text-sm mb-3" numberOfLines={2}>
            {course.description}
          </Text>
          
          <View className="flex-row items-center justify-between mt-2">
             <Text className="text-lg font-bold text-gray-900">${course.price}</Text>
             <View className="bg-blue-50 px-3 py-1 rounded-full">
                <Text className="text-blue-700 text-xs font-medium">Enroll Now</Text>
             </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
});
