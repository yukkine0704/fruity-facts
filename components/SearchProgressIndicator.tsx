import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { IconSymbol } from "./ui/IconSymbol";

const AnimatedView = Animated.createAnimatedComponent(View);

interface SearchProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  currentSearchTerm: string;
  progress: number;
}

interface SearchStep {
  title: string;
  description: string;
  icon: string;
}

const searchSteps: SearchStep[] = [
  {
    title: "Búsqueda directa",
    description: "Buscando por el nombre exacto de la fruta",
    icon: "magnifyingglass",
  },
  {
    title: "Búsqueda con variaciones",
    description: "Probando con términos como 'fresh' y 'raw'",
    icon: "list.bullet",
  },
  {
    title: "Búsqueda ampliada",
    description: "Explorando la base de datos USDA",
    icon: "server.rack",
  },
  {
    title: "Procesando resultados",
    description: "Analizando la información encontrada",
    icon: "gearshape.2.fill",
  },
];

export const SearchProgressIndicator: React.FC<
  SearchProgressIndicatorProps
> = ({ currentStep, totalSteps, currentSearchTerm, progress }) => {
  const { theme } = useTheme();
  const progressAnim = useSharedValue(0);

  React.useEffect(() => {
    progressAnim.value = withTiming(progress / 100, { duration: 500 });
  }, [progress]);

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(
        progressAnim.value,
        [0, 1],
        [0, 100],
        Extrapolate.CLAMP
      )}%`,
    };
  });

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      elevation={2}
    >
      <View style={styles.header}>
        <IconSymbol
          name="magnifyingglass"
          size={24}
          color={theme.colors.primary}
        />
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurface, marginLeft: 12 }}
        >
          Buscando información nutricional
        </Text>
      </View>

      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.outline, marginBottom: 16 }}
      >
        Término actual: "{currentSearchTerm}"
      </Text>

      <View style={styles.progressSection}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: theme.colors.outline },
          ]}
        >
          <AnimatedView
            style={[
              styles.progressFill,
              { backgroundColor: theme.colors.primary },
              progressAnimatedStyle,
            ]}
          />
        </View>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.outline, marginTop: 8 }}
        >
          {Math.round(progress)}% completado
        </Text>
      </View>

      <View style={styles.stepsContainer}>
        {searchSteps.map((step, index) => {
          const isActive =
            index ===
            Math.floor(((currentStep - 1) * searchSteps.length) / totalSteps);
          const isCompleted =
            index <
            Math.floor(((currentStep - 1) * searchSteps.length) / totalSteps);

          return (
            <View key={index} style={styles.stepItem}>
              <View
                style={[
                  styles.stepIcon,
                  {
                    backgroundColor: isCompleted
                      ? theme.colors.primary
                      : isActive
                      ? theme.colors.primaryContainer
                      : theme.colors.outline,
                  },
                ]}
              >
                <IconSymbol
                  name={isCompleted ? "checkmark" : (step.icon as any)}
                  size={16}
                  color={
                    isCompleted || isActive
                      ? theme.colors.onPrimary
                      : theme.colors.onSurface
                  }
                />
              </View>
              <View style={styles.stepContent}>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: isActive
                      ? theme.colors.primary
                      : theme.colors.onSurface,
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                >
                  {step.title}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.outline }}
                >
                  {step.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    margin: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  stepsContainer: {
    gap: 12,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
});
