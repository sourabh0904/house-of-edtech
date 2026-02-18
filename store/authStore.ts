import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';

interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: {
      url: string;
      localPath?: string;
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfileImage: (uri: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (user, token) => {
    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userData');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      if (Platform.OS !== 'web') {
        const token = await SecureStore.getItemAsync('authToken');
        const userData = await SecureStore.getItemAsync('userData');

      if (token && userData) {
          set({ 
            token, 
            user: JSON.parse(userData), 
            isAuthenticated: true 
          });
        } else {
            set({ isAuthenticated: false, user: null, token: null });
        }
      }
    } catch (error) {
      console.error('Failed to load user', error);
      set({ isAuthenticated: false, user: null, token: null });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfileImage: async (imageUri: string) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = {
        ...user,
        avatar: {
            ...user.avatar,
            url: imageUri, // for our local purpose, we treat url as the display uri
            localPath: imageUri
        }
    };

    if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
    }
    
    set({ user: updatedUser });
  }
}));
