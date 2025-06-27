import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface SearchStepItemProps {
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  isCompleted: boolean;
}

export const SearchStepItem: React.FC<SearchStepItemProps> = ({
  title,
  description,
  icon,
  isActive,
  isCompleted,
}) => {
  const { theme } = useTheme();
  const stepAnim = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      stepAnim.value = withSpring(1, { damping: 10, stiffness: 100 });
    } else if (isCompleted) {
      stepAnim.value = withTiming(1, { duration: 200 });
    } else {
      stepAnim.value = withTiming(0, { duration: 200 });
    }
  }, [isActive, isCompleted]);

  const stepAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      stepAnim.value,
      [0, 1],
      [0.9, 1],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      stepAnim.value,
      [0, 1],
      [0.5, 1],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      stepAnim.value,
      [0, 1],
      [10, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <Animated.View style={[styles.stepItem, stepAnimatedStyle]}>
      <View
        style={[
          styles.stepIcon,
          {
            backgroundColor: isCompleted
              ? theme.colors.primary
              : isActive
              ? theme.colors.primaryContainer
              : theme.colors.surfaceVariant,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={isCompleted ? "check" : (icon as any)}
          size={18}
          color={
            isCompleted
              ? theme.colors.onPrimary
              : isActive
              ? theme.colors.onPrimaryContainer
              : theme.colors.onSurfaceVariant
          }
        />
      </View>
      <View style={styles.stepContent}>
        <Text
          variant="bodyMedium"
          style={{
            color: isActive ? theme.colors.primary : theme.colors.onSurface,
            fontWeight: isActive ? "bold" : "normal",
          }}
        >
          {title}
        </Text>
        <Text
          variant="bodySmall"
          style={{
            color: theme.colors.outline,
            opacity: isActive ? 1 : 0.7,
          }}
        >
          {description}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
});
