import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

interface AnimatedEmptyStateProps {
  onRefresh: () => void;
}

export const AnimatedEmptyState: React.FC<AnimatedEmptyStateProps> = ({
  onRefresh,
}) => {
  const { theme } = useTheme();

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const iconFloat = useSharedValue(0);
  const buttonScale = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    // Animación de entrada
    scale.value = withSpring(1, { damping: 12, stiffness: 80 });
    opacity.value = withTiming(1, { duration: 800 });

    // Animación flotante del ícono
    iconFloat.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 2000 }),
          withTiming(10, { duration: 2000 })
        ),
        -1,
        true
      )
    );

    // Animación del botón
    buttonScale.value = withDelay(
      600,
      withSpring(1, { damping: 8, stiffness: 100 })
    );

    // Efecto shimmer sutil
    shimmer.value = withDelay(
      800,
      withRepeat(withTiming(1, { duration: 3000 }), -1, true)
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
      transform: [{ translateY: iconFloat.value }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    const shimmerOpacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.7, 1, 0.7]
    );

    return {
      opacity: shimmerOpacity,
    };
  });

  return (
    <AnimatedSurface
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceVariant },
        containerAnimatedStyle,
      ]}
      elevation={1}
    >
      <Animated.View style={[iconAnimatedStyle, shimmerAnimatedStyle]}>
        <IconSymbol
          name="questionmark.folder"
          size={80}
          color={theme.colors.onSurfaceVariant}
          style={styles.icon}
        />
      </Animated.View>

      <Text
        variant="headlineSmall"
        style={[styles.title, { color: theme.colors.onSurfaceVariant }]}
      >
        No hay frutas disponibles
      </Text>

      <Text
        variant="bodyMedium"
        style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
      >
        Parece que no pudimos cargar las frutas.{"\n"}
        ¡Intenta recargar para descubrir deliciosas frutas!
      </Text>

      <Animated.View style={buttonAnimatedStyle}>
        <Button
          mode="contained"
          onPress={onRefresh}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          icon="refresh"
          labelStyle={{ color: theme.colors.onPrimary }}
        >
          Recargar Frutas
        </Button>
      </Animated.View>
    </AnimatedSurface>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
});
