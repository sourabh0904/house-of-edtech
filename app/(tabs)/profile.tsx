import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';

export default function ProfileScreen() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const updateProfileImage = useAuthStore((state) => state.updateProfileImage);
  
  const enrolledCount = useCourseStore((state) => state.enrolledCourses.length);
  const bookmarksCount = useCourseStore((state) => state.bookmarks.length);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "You need to grant camera roll permissions to change your profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        await updateProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile picture.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
      <View className="items-center py-10 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={handlePickImage} className="relative mb-4">
          <Image
            source={user?.avatar?.url ? { uri: user.avatar.url } : { uri: 'https://ui-avatars.com/api/?name=' + (user?.username || 'User') + '&background=random' }}
            className="w-28 h-28 rounded-full bg-gray-200"
            contentFit="cover"
          />
          <View className="absolute bottom-0 right-0 bg-blue-600 w-8 h-8 rounded-full items-center justify-center border-2 border-white">
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>
        
        <Text className="text-2xl font-bold text-gray-900">{user?.username || 'Guest'}</Text>
        <Text className="text-gray-500 mt-1">{user?.email}</Text>
      </View>

      <View className="flex-row justify-center py-6 bg-white mt-4 border-y border-gray-100">
        <View className="items-center px-8 border-r border-gray-100">
          <Text className="text-2xl font-bold text-blue-600">{enrolledCount}</Text>
          <Text className="text-gray-500 text-sm">Enrolled</Text>
        </View>
        <View className="items-center px-8">
          <Text className="text-2xl font-bold text-blue-600">{bookmarksCount}</Text>
          <Text className="text-gray-500 text-sm">Bookmarks</Text>
        </View>
      </View>

      <View className="p-6 mt-4">
        <TouchableOpacity 
          onPress={logout}
          className="bg-red-50 flex-row items-center justify-center px-6 py-4 rounded-xl border border-red-100"
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 8 }} />
          <Text className="text-red-600 font-semibold text-lg">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
