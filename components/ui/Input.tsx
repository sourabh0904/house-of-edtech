import { Text, TextInput, TextInputProps, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({ label, error, containerClassName, className, ...props }: InputProps) {
  return (
    <View className={twMerge("space-y-2", containerClassName)}>
      {label && <Text className="text-gray-700 font-medium text-sm ml-1">{label}</Text>}
      <TextInput
        placeholderTextColor="#9CA3AF"
        className={twMerge(
          "h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:border-blue-500 focus:bg-white",
          error && "border-red-500 bg-red-50",
          className
        )}
        {...props}
      />
      {error && <Text className="text-red-500 text-xs ml-1">{error}</Text>}
    </View>
  );
}
