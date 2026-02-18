import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function OfflineBanner() {
  const netInfo = useNetInfo();
  const insets = useSafeAreaInsets();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (netInfo.isConnected === false) {
      setIsOffline(true);
    } else {
      setIsOffline(false);
    }
  }, [netInfo.isConnected]);

  if (!isOffline) return null;

  return (
    <View 
      style={{ paddingTop: insets.top }} 
      className="bg-red-500 w-full absolute top-0 z-50 items-center justify-center pb-2"
    >
      <Text className="text-white font-medium text-sm mt-1">
        No Internet Connection
      </Text>
    </View>
  );
}
