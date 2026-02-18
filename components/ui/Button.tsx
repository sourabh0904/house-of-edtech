import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({ title, onPress, variant = 'primary', isLoading, disabled, className }: ButtonProps) {
  const baseStyles = "h-12 rounded-xl flex-row items-center justify-center px-6";
  
  const variants = {
    primary: "bg-blue-600 active:bg-blue-700",
    secondary: "bg-gray-100 active:bg-gray-200",
    outline: "border border-gray-300 bg-transparent active:bg-gray-50",
  };

  const textVariants = {
    primary: "text-white font-semibold text-base",
    secondary: "text-gray-900 font-semibold text-base",
    outline: "text-gray-700 font-semibold text-base",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={twMerge(
        baseStyles,
        variants[variant],
        (disabled || isLoading) && "opacity-50",
        className
      )}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : 'gray'} />
      ) : (
        <Text className={textVariants[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
