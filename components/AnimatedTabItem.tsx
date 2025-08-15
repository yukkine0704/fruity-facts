// components/AnimatedTabItem.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Definimos los props para el componente
interface AnimatedTabItemProps {
  route: {
    key: string;
    title: string;
    focusedIcon: string;
    unfocusedIcon: string;
  };
  isActive: boolean;
  onPress: () => void;
}

export default function AnimatedTabItem({
  route,
  isActive,
  onPress,
}: AnimatedTabItemProps) {
  const { theme } = useTheme();

  // Los hooks ahora se llaman en el nivel superior de este componente
  const tabScale = useSharedValue(1);

  const tabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: tabScale.value }],
    };
  });

  const handlePressIn = () => {
    tabScale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    tabScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <AnimatedPressable
      key={route.key}
      style={[styles.tabItem, tabAnimatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        style={[
          styles.tabIconContainer,
          isActive && {
            backgroundColor: theme.colors.primaryContainer,
          },
        ]}
      >
        <IconButton
          icon={isActive ? route.focusedIcon : route.unfocusedIcon}
          size={24}
          iconColor={
            isActive
              ? theme.colors.onPrimaryContainer
              : theme.colors.onSurfaceVariant
          }
          style={{ margin: 0 }}
        />
      </View>
      {isActive && (
        <Text
          variant="labelSmall"
          style={{
            color: theme.colors.primary,
            fontWeight: "600",
            marginTop: 2,
          }}
        >
          {route.title}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabIconContainer: {
    borderRadius: 20,
    padding: 4,
  },
});
