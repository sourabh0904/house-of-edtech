import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { useCourseStore } from '@/store/courseStore';

export default function CourseLearnScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  
  const courseId = parseInt(id);
  const course = useCourseStore((state: any) => state.getCourseById(courseId));

  if (!course) {
      return (
          <View className="flex-1 items-center justify-center bg-white">
              <Text className="text-gray-500">Course content not available.</Text>
          </View>
      )
  }

  // In a real app, we would fetch course content URL or HTML from API.
  // Here we inject a simple template.
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333; }
          h1 { color: #2563EB; }
          .btn { background-color: #2563EB; color: white; padding: 12px 20px; border: none; border-radius: 8px; font-size: 16px; margin-top: 20px; width: 100%; }
          .instructor { display: flex; align-items: center; margin-bottom: 20px; }
          .instructor img { width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; }
        </style>
      </head>
      <body>
        <h1>${course.title}</h1>
        <div class="instructor">
            <img src="${course.instructor.avatar}" alt="${course.instructor.name}" />
            <strong>${course.instructor.name}</strong>
        </div>
        <p>${course.description}</p>
        <hr/>
        <h3>Module 1: Getting Started</h3>
        <p>Welcome to this course! In this module, we will cover the basics.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <br/>
        <h3>Video Lesson</h3>
        <div style="background: #eee; height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
            [Video Player Placeholder]
        </div>
        <br/>
        <button class="btn" onclick="completeLesson()">Complete Lesson</button>

        <script>
          function completeLesson() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'COMPLETE_LESSON', courseId: '${id}' }));
          }
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'COMPLETE_LESSON') {
        Alert.alert('Congratulations!', 'You completed this lesson.', [
          { text: 'Next Lesson', onPress: () => console.log('Next lesson') },
          { text: 'Finish', onPress: () => router.back() }
        ]);
      }
    } catch (e) {
      console.error("Failed to parse message from WebView", e);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Learning Mode', headerBackTitle: 'Course' }} />
      <View className="flex-1 bg-white">
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          onMessage={handleMessage}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" color="#2563EB" className="absolute top-1/2 left-1/2" />}
          renderError={() => (
            <View className="absolute top-0 bottom-0 left-0 right-0 justify-center items-center bg-white">
                <Text className="text-red-500">Failed to load content.</Text>
            </View>
          )}
        />
      </View>
    </>
  );
}
