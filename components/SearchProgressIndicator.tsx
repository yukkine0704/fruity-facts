import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";
import Animated, {
  Extrapolate,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SearchStepItem } from "./SearchStepItem";

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
    icon: "magnify",
  },
  {
    title: "Búsqueda con variaciones",
    description: "Probando con términos como 'fresco' y 'crudo'",
    icon: "format-list-bulleted",
  },
  {
    title: "Búsqueda ampliada",
    description: "Explorando la base de datos USDA",
    icon: "database-search",
  },
  {
    title: "Procesando resultados",
    description: "Analizando la información encontrada",
    icon: "cog-outline",
  },
  {
    title: "Refinando información",
    description: "Organizando datos para mostrar",
    icon: "chart-bar",
  },
];

export const SearchProgressIndicator: React.FC<
  SearchProgressIndicatorProps
> = ({ currentStep, totalSteps, currentSearchTerm, progress }) => {
  const { theme } = useTheme();
  const progressAnim = useSharedValue(0);

  // Animación para el icono de búsqueda del header
  const headerIconScale = useSharedValue(1);
  const headerIconOpacity = useSharedValue(0);

  // Animaciones para la "ola" o "ripple"
  const waveScale = useSharedValue(0);
  const waveOpacity = useSharedValue(0);

  // Referencias para controlar el estado sin acceder a .value durante el render
  const waveAnimationStarted = useRef(false);
  const headerAnimationStarted = useRef(false);
  const waveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    progressAnim.value = withTiming(progress / 100, { duration: 500 });

    // Solo actualizar el término de búsqueda si hay uno
    if (currentSearchTerm) {
      // Animación de la "ola" - solo iniciar una vez por término
      if (progress > 0 && !waveAnimationStarted.current) {
        waveAnimationStarted.current = true;
        waveScale.value = withTiming(1.5, { duration: 1500 });
        waveOpacity.value = withTiming(0, { duration: 1500 });
      }

      // Reiniciar la animación de la ola para cada nuevo término
      if (waveIntervalRef.current) {
        clearInterval(waveIntervalRef.current);
      }

      if (progress > 0 && progress < 100) {
        waveIntervalRef.current = setInterval(() => {
          waveScale.value = 0;
          waveOpacity.value = 0.5;
          waveScale.value = withTiming(1.5, { duration: 1500 });
          waveOpacity.value = withTiming(0, { duration: 1500 });
        }, 2000);
      }
    }

    // Animación para el icono principal del header
    if (progress > 0 && !headerAnimationStarted.current) {
      headerAnimationStarted.current = true;
      headerIconScale.value = withSpring(1.1, { damping: 10, stiffness: 100 });
      headerIconOpacity.value = withTiming(1, { duration: 300 });
    }

    return () => {
      if (waveIntervalRef.current) {
        clearInterval(waveIntervalRef.current);
      }
    };
  }, [progress, currentSearchTerm]); // Agregar currentSearchTerm como dependencia

  // Limpiar al desmontar el componente
  useEffect(() => {
    return () => {
      if (waveIntervalRef.current) {
        clearInterval(waveIntervalRef.current);
      }
    };
  }, []);

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

  const waveAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: waveScale.value }],
      opacity: waveOpacity.value,
    };
  });

  // Animación para el icono principal del header
  const headerIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: headerIconScale.value }],
      opacity: headerIconOpacity.value,
    };
  });

  return (
    <Surface
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceContainerLow },
      ]}
      elevation={theme.dark ? 1 : 2}
    >
      <View style={styles.header}>
        {/* Onda de animación detrás del icono principal */}
        <Animated.View
          style={[
            styles.waveCircle,
            { backgroundColor: theme.colors.primaryContainer },
            waveAnimatedStyle,
          ]}
        />
        {/* Icono principal animado */}
        <Animated.View style={headerIconAnimatedStyle}>
          <MaterialCommunityIcons
            name="leaf-maple"
            size={48}
            color={theme.colors.primary}
          />
        </Animated.View>

        <Text
          variant="titleLarge"
          style={{ color: theme.colors.onSurface, marginLeft: 16 }}
        >
          Buscando información nutricional
        </Text>
      </View>

      <Animated.Text
        entering={FadeIn.delay(300).duration(500)}
        exiting={FadeOut.duration(300)}
        key={currentSearchTerm || "preparing"}
        style={{ color: theme.colors.outline, marginBottom: 16 }}
      >
        Término actual: "{currentSearchTerm || "Preparando búsqueda..."}"
      </Animated.Text>

      <View style={styles.progressSection}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: theme.colors.surfaceContainerHigh },
          ]}
        >
          <Animated.View
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
          const activeStepIndex = Math.floor(
            ((currentStep - 1) / totalSteps) * searchSteps.length
          );
          const isActive = index === activeStepIndex;
          const isCompleted = index < activeStepIndex;

          return (
            <SearchStepItem
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
              isActive={isActive}
              isCompleted={isCompleted}
            />
          );
        })}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },
  waveCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0,
    zIndex: 0,
  },
  progressSection: {
    marginBottom: 24,
    alignItems: "center",
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  stepsContainer: {
    gap: 16,
  },
});
