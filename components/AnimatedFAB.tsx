import React, { useEffect } from 'react';
import { FAB } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

const AnimatedFAB = Animated.createAnimatedComponent(FAB);

interface AnimatedFABProps {
  onPress: () => void;
  loading?: boolean;
  icon?: string;
  style?: any;
}

export const AnimatedRefreshFAB: React.FC<AnimatedFABProps> = ({
  onPress,
  loading = false,
  icon = 'refresh',
  style,
}) => {
  const { theme } = useTheme();
  
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Animación de entrada
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });

    // Animación de pulso cuando está cargando
    if (loading) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
      
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
      rotation.value = withTiming(0, { duration: 300 });
    }
  }, [loading]);

  const handlePress = () => {
    // Animación de press con feedback háptico
    scale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withSpring(1, { damping: 8, stiffness: 150 })
    );
    
    rotation.value = withSequence(
      withTiming(180, { duration: 200 }),
      withTiming(360, { duration: 200 }),
      withTiming(0, { duration: 0 })
    );

    runOnJS(onPress)();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value * pulseScale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  return (
    <AnimatedFAB
      icon={icon}
      style={[
        {
          backgroundColor: theme.colors.primary,
          borderRadius: 28,
        },
        style,
        animatedStyle,
      ]}
      onPress={handlePress}
      loading={loading}
      disabled={loading}
    />
  );
};