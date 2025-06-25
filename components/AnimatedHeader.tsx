import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { NutritionStats } from "@/types/fruit";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedView = Animated.createAnimatedComponent(View);

interface AnimatedHeaderProps {
  nutritionStats?: NutritionStats | null;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  nutritionStats,
}) => {
  const { theme } = useTheme();

  const iconScale = useSharedValue(0);
  const iconRotation = useSharedValue(-180);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const statsScale = useSharedValue(0);
  const statsOpacity = useSharedValue(0);

  useEffect(() => {
    // Secuencia de animaciones
    iconScale.value = withDelay(
      200,
      withSpring(1, { damping: 12, stiffness: 100 })
    );

    iconRotation.value = withDelay(
      200,
      withSpring(0, { damping: 15, stiffness: 80 })
    );

    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    titleTranslateY.value = withDelay(
      400,
      withSpring(0, { damping: 12, stiffness: 80 })
    );

    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));

    if (nutritionStats) {
      statsScale.value = withDelay(
        800,
        withSpring(1, { damping: 10, stiffness: 100 })
      );

      statsOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    }
  }, [nutritionStats]);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: iconScale.value },
        { rotate: `${iconRotation.value}deg` },
      ],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ translateY: titleTranslateY.value }],
    };
  });

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
    };
  });

  const statsAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: statsScale.value }],
      opacity: statsOpacity.value,
    };
  });

  const StatItem: React.FC<{
    value: string | number;
    label: string;
    color: string;
    delay: number;
  }> = ({ value, label, color, delay }) => {
    const itemScale = useSharedValue(0);
    const itemOpacity = useSharedValue(0);

    useEffect(() => {
      itemScale.value = withDelay(
        delay,
        withSpring(1, { damping: 8, stiffness: 100 })
      );

      itemOpacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    }, [delay]);

    const itemAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: itemScale.value }],
        opacity: itemOpacity.value,
      };
    });

    return (
      <AnimatedView style={[styles.statItem, itemAnimatedStyle]}>
        <Text variant="titleMedium" style={{ color, fontWeight: "bold" }}>
          {value}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
          {label}
        </Text>
      </AnimatedView>
    );
  };

  return (
    <AnimatedSurface
      style={[
        styles.header,
        { backgroundColor: theme.colors.primaryContainer },
      ]}
      elevation={3}
    >
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol
          size={60}
          color={theme.colors.onPrimaryContainer}
          name="apple.logo"
          style={styles.headerIcon}
        />
      </Animated.View>

      <Animated.View style={titleAnimatedStyle}>
        <Text
          variant="headlineLarge"
          style={[styles.title, { color: theme.colors.onPrimaryContainer }]}
        >
          Fruity Facts
        </Text>
      </Animated.View>

      <Animated.View style={subtitleAnimatedStyle}>
        <Text
          variant="bodyMedium"
          style={[styles.subtitle, { color: theme.colors.onPrimaryContainer }]}
        >
          Descubre el mundo de las frutas y sus beneficios nutricionales
        </Text>
      </Animated.View>

      {nutritionStats && (
        <AnimatedSurface
          style={[
            styles.statsContainer,
            { backgroundColor: theme.colors.surface },
            statsAnimatedStyle,
          ]}
          elevation={2}
        >
          <StatItem
            value={nutritionStats.totalFruits}
            label="Frutas"
            color={theme.colors.primary}
            delay={1000}
          />
          <StatItem
            value={nutritionStats.averageCalories}
            label="Cal. promedio"
            color={theme.colors.secondary}
            delay={1100}
          />
          <StatItem
            value={nutritionStats.highestProtein.name}
            label="Más proteína"
            color={theme.colors.tertiary}
            delay={1200}
          />
        </AnimatedSurface>
      )}
    </AnimatedSurface>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  headerIcon: {
    marginBottom: 12,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    width: "100%",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
});
