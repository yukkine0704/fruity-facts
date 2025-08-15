// src/components/Explore/FruitCard.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { Fruit } from "@/types/fruit";
import { Flame, Package, Star } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface FruitCardProps {
  fruit: Fruit;
  onPress?: (fruit: Fruit) => void;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FruitCard: React.FC<FruitCardProps> = ({
  fruit,
  onPress,
  index = 0,
}) => {
  const { theme } = useTheme();

  // Valores animados para la entrada escalonada
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = index * 100;
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 10, stiffness: 100 })
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, [index]);

  // Estilos animados para la entrada
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const handlePress = () => {
    if (onPress) {
      onPress(fruit);
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.card, cardAnimatedStyle]}
    >
      <Card
        style={[
          styles.innerCard,
          { backgroundColor: theme.colors.surfaceContainerLow },
        ]}
        elevation={theme.dark ? 2 : 3}
      >
        <View style={styles.cardContent}>
          {/* Imagen de la fruta */}
          <View style={styles.imageContainer}></View>

          {/* Contenido de la fruta */}
          <View style={styles.detailsContainer}>
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={[styles.title, { color: theme.colors.onSurface }]}
            >
              {fruit.name}
            </Text>

            <View style={styles.infoRow}>
              {/* Ícono de calorías */}
              <View style={styles.infoItem}>
                <Flame size={16} stroke={theme.colors.onSurfaceVariant} />
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {Math.round(fruit.nutritions.calories)} cal
                </Text>
              </View>
              {/* Ícono de proteína */}
              <View style={styles.infoItem}>
                <Package size={16} stroke={theme.colors.onSurfaceVariant} />
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {fruit.nutritions.protein}g prot
                </Text>
              </View>
            </View>
          </View>

          {/* Ícono de favorito */}
          <Star size={24} stroke={theme.colors.onSurfaceVariant} />
        </View>
      </Card>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  innerCard: {
    borderRadius: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
