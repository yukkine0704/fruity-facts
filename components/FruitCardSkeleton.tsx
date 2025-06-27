import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native"; // Importamos View para el shimmer
import { Card, Surface } from "react-native-paper";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const AnimatedCard = Animated.createAnimatedComponent(Card);

interface FruitCardSkeletonProps {
  index?: number;
}

export const FruitCardSkeleton: React.FC<FruitCardSkeletonProps> = ({
  index = 0,
}) => {
  const { theme } = useTheme();
  const shimmerAnimation = useSharedValue(0);
  const scaleAnimation = useSharedValue(0);
  const opacityAnimation = useSharedValue(0);

  useEffect(() => {
    // Animación de entrada escalonada (similar a FruitCard)
    const delay = index * 120; // Coincidir con el delay de FruitCard

    scaleAnimation.value = withDelay(
      delay,
      withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      })
    );

    opacityAnimation.value = withDelay(delay, withTiming(1, { duration: 600 }));

    // Animación de shimmer (brillo que se mueve)
    shimmerAnimation.value = withDelay(
      delay + 200, // Inicia un poco después de la aparición de la tarjeta
      withRepeat(
        withTiming(1, {
          duration: 1800, // Ligeramente más lento para un efecto más suave
          easing: Easing.inOut(Easing.ease),
        }),
        -1, // Repetir infinitamente
        true // Animar en reversa
      )
    );
  }, [index]);

  // Componente auxiliar para los bloques de esqueleto
  const SkeletonBox: React.FC<{
    width: number | string;
    height: number;
    style?: any;
    borderRadius?: number; // Propiedad para un borderRadius personalizado
  }> = ({ width, height, style, borderRadius = 8 }) => {
    const shimmerStyle = useAnimatedStyle(() => {
      // Ajustar el rango de traducción para que el brillo cubra el ancho del esqueleto
      const translateX = interpolate(
        shimmerAnimation.value,
        [0, 1],
        typeof width === "number" ? [-width, width] : [-100, 100]
      );

      return {
        transform: [{ translateX }],
      };
    });

    return (
      <View
        style={[
          {
            width,
            height,
            backgroundColor: theme.colors.surfaceVariant, // Color de fondo del esqueleto (un tono más claro)
            borderRadius: borderRadius,
            overflow: "hidden", // Necesario para que el shimmer se recorte dentro del SkeletonBox
          },
          style,
        ]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject, // Cubre todo el área del View padre
            {
              backgroundColor: theme.colors.surfaceContainerHigh, // Color del brillo (más brillante)
              // Ajustar el ancho del brillo para que sea visible
              width: "50%", // O un valor fijo como 100
              opacity: 0.5, // Opacidad fija para el brillo
            },
            shimmerStyle,
          ]}
        />
      </View>
    );
  };

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnimation.value }],
      opacity: opacityAnimation.value,
    };
  });

  return (
    <AnimatedCard
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceContainerLow }, // Coincide con el color de fondo de FruitCard
        cardAnimatedStyle,
      ]}
      elevation={theme.dark ? 1 : 2} // Coincide con la elevación de FruitCard
    >
      <Card.Content style={styles.content}>
        {/* Header Skeleton */}
        <Surface
          style={[
            styles.header,
            { backgroundColor: theme.colors.primaryContainer }, // Coincide con el color del header de FruitCard
          ]}
          elevation={theme.dark ? 0 : 1} // Coincide con la elevación del header de FruitCard
        >
          <SkeletonBox width={40} height={40} borderRadius={20} />{" "}
          {/* Círculo para el icono */}
          <SkeletonBox
            width="70%"
            height={24}
            borderRadius={12} // Redondeado como el texto
            style={{ marginLeft: 12 }}
          />
        </Surface>

        {/* Taxonomy Section Skeleton */}
        <Surface
          style={[
            styles.taxonomySection,
            { backgroundColor: theme.colors.surfaceContainerHigh }, // Coincide con el color de la sección de taxonomía
          ]}
          elevation={theme.dark ? 0 : 1}
        >
          <SkeletonBox
            width="40%"
            height={16} // Más alto para el título de la sección
            borderRadius={8}
            style={{ marginBottom: 12 }} // Más espacio debajo del título
          />
          <SkeletonBox
            width="80%"
            height={16}
            borderRadius={8}
            style={{ marginBottom: 4 }}
          />
          <SkeletonBox width="75%" height={16} borderRadius={8} />
        </Surface>

        {/* Nutrition Section Skeleton */}
        <Surface
          style={[
            styles.nutritionSection,
            { backgroundColor: theme.colors.secondaryContainer }, // Coincide con el color de la sección de nutrición
          ]}
          elevation={theme.dark ? 0 : 1}
        >
          <SkeletonBox
            width="60%"
            height={16} // Más alto para el título de la sección
            borderRadius={8}
            style={{ marginBottom: 12 }} // Más espacio debajo del título
          />
          <View style={styles.nutritionGrid}>
            {" "}
            {/* Usamos View para los children */}
            {/* Los ítems de nutrición ahora tienen un ancho más flexible */}
            <SkeletonBox
              width={"48%"} // Aproximadamente la mitad, menos el gap
              height={28}
              borderRadius={20} // Coincide con el estilo de "pill"
            />
            <SkeletonBox width={"48%"} height={28} borderRadius={20} />
            <SkeletonBox width={"48%"} height={28} borderRadius={20} />
            <SkeletonBox width={"48%"} height={28} borderRadius={20} />
          </View>
        </Surface>

        {/* ID Chip Skeleton */}
        <SkeletonBox
          width={70} // Ajustamos el ancho para que parezca un chip pequeño
          height={32}
          borderRadius={16} // Coincide con el estilo del chip
          style={styles.idChip} // Aplicamos el estilo para posicionamiento
        />
      </Card.Content>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20, // Coincide con FruitCard
    overflow: "hidden",
  },
  content: {
    padding: 0, // Coincide con FruitCard
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16, // Coincide con FruitCard
    paddingHorizontal: 20, // Coincide con FruitCard
    borderTopLeftRadius: 20, // Coincide con FruitCard
    borderTopRightRadius: 20,
    marginBottom: 16, // Coincide con FruitCard
  },
  taxonomySection: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16, // Coincide con FruitCard
    marginHorizontal: 16, // Coincide con FruitCard
    marginBottom: 16,
  },
  nutritionSection: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16, // Coincide con FruitCard
    marginHorizontal: 16,
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // Coincide con FruitCard
    justifyContent: "space-between", // Coincide con FruitCard
    backgroundColor: "transparent", // Asegurarse que no tenga un fondo sólido
  },
  idChip: {
    alignSelf: "flex-end", // Coincide con FruitCard
    marginHorizontal: 16,
    marginBottom: 16, // Coincide con FruitCard
  },
});
