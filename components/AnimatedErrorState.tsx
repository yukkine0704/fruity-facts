import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

interface AnimatedErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const AnimatedErrorState: React.FC<AnimatedErrorStateProps> = ({
  error,
  onRetry,
}) => {
  const { theme } = useTheme();

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const buttonScale = useSharedValue(0);

  useEffect(() => {
    // Animación de entrada
    scale.value = withSpring(1, { damping: 10, stiffness: 80 });
    opacity.value = withTiming(1, { duration: 600 });

    // Animación del ícono
    iconRotation.value = withDelay(
      200,
      withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      )
    );

    // Animación del botón
    buttonScale.value = withDelay(
      400,
      withSpring(1, { damping: 8, stiffness: 100 })
    );
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${iconRotation.value}deg` }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  return (
    <AnimatedSurface
      style={[
        styles.container,
        { backgroundColor: theme.colors.errorContainer },
        containerAnimatedStyle,
      ]}
      elevation={2}
    >
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol
          name="exclamationmark.triangle"
          size={64}
          color={theme.colors.onErrorContainer}
          style={styles.icon}
        />
      </Animated.View>

      <Text
        variant="titleLarge"
        style={[styles.title, { color: theme.colors.onErrorContainer }]}
      >
        ¡Ups! Algo salió mal
      </Text>

      <Text
        variant="bodyMedium"
        style={[styles.message, { color: theme.colors.onErrorContainer }]}
      >
        {error}
      </Text>

      <Animated.View style={buttonAnimatedStyle}>
        <Button
          mode="contained"
          onPress={onRetry}
          style={[styles.button, { backgroundColor: theme.colors.error }]}
          labelStyle={{ color: theme.colors.onError }}
        >
          Reintentar
        </Button>
      </Animated.View>
    </AnimatedSurface>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    borderRadius: 24,
    paddingHorizontal: 16,
  },
});
