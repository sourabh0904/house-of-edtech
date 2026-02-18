import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login', {
        username,
        password,
      });

      const { data } = response.data;
      // The API returns { data: { user: ..., accessToken: ..., refreshToken: ... } }
      
      await login(data.user, data.accessToken);
      // Router redirect is handled by usage of useAuthStore in _layout.tsx usually, 
      // but we can also manually push if needed, though reactive is better.
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-10">
          <View className="items-center mb-10">
            <View className="w-20 h-20 bg-blue-100 rounded-2xl items-center justify-center mb-4">
              <Text className="text-4xl">🎓</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900">Welcome Back!</Text>
            <Text className="text-gray-500 mt-2 text-center">
              Sign in to continue your learning journey
            </Text>
          </View>

          <View className="space-y-4">
            <Input
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              error={error ? ' ' : undefined} // Just to trigger red border if error generic? Or keep specific
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            {error ? <Text className="text-red-500 text-sm text-center">{error}</Text> : null}

            <Button 
              title="Sign In" 
              onPress={handleLogin} 
              isLoading={loading}
              className="mt-4"
            />
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
