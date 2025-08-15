// components/FoodDetailsSkeleton.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const FoodDetailsSkeleton = () => {
  const theme = useTheme();
  const opacity = useSharedValue(0.5);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      backgroundColor: theme.colors.surfaceVariant,
    };
  });

  return (
    <View style={styles.container}>
      {/* Esqueleto para la imagen */}
      <Animated.View style={[styles.image, animatedStyle]} />

      {/* Esqueleto para el título y metadatos */}
      <Animated.View style={[styles.title, animatedStyle]} />
      <Animated.View style={[styles.metadata, animatedStyle]} />
      <Animated.View style={[styles.metadata, animatedStyle]} />

      {/* Esqueleto para la sección de nutrientes */}
      <Animated.View style={[styles.sectionTitle, animatedStyle]} />
      {[...Array(6)].map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.nutrientItem, animatedStyle]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 24,
    marginBottom: 24,
  },
  title: {
    width: "80%",
    height: 30,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 16,
  },
  metadata: {
    width: "40%",
    height: 15,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    width: "60%",
    height: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  nutrientItem: {
    width: "100%",
    height: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default FoodDetailsSkeleton;
