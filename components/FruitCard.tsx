import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { Fruit } from "@/types/fruit";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Card, Chip, Surface, Text } from "react-native-paper";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface FruitCardProps {
  fruit: Fruit;
  onPress?: (fruit: Fruit) => void;
  index?: number;
}

const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FruitCard: React.FC<FruitCardProps> = ({
  fruit,
  onPress,
  index = 0,
}) => {
  const { theme } = useTheme();

  // Valores animados
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const pressScale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Animación de entrada escalonada
    const delay = index * 100;

    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 15,
        stiffness: 100,
      })
    );

    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));

    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 12,
        stiffness: 80,
      })
    );

    // Pequeña rotación inicial
    rotation.value = withDelay(
      delay + 200,
      withSequence(
        withTiming(2, { duration: 200 }),
        withTiming(0, { duration: 200 })
      )
    );
  }, [index]);

  const handlePressIn = () => {
    pressScale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
  };

  const handlePress = () => {
    // Animación de feedback
    pressScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 150 })
    );

    if (onPress) {
      runOnJS(onPress)(fruit);
    }
  };

  // Estilos animados
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value * pressScale.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const nutritionItemAnimatedStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(pressScale.value, [0.95, 1], [0.9, 1]);

    return {
      transform: [{ scale: scaleValue }],
    };
  });

  const getFruitEmoji = (name: string): string => {
    const fruitEmojis: { [key: string]: string } = {
      apple: "🍎",
      banana: "🍌",
      orange: "🍊",
      strawberry: "🍓",
      grape: "🍇",
      watermelon: "🍉",
      pineapple: "🍍",
      peach: "🍑",
      lemon: "🍋",
      lime: "🟢",
      cherry: "🍒",
      pear: "🍐",
      kiwi: "🥝",
      mango: "🥭",
      coconut: "🥥",
      avocado: "🥑",
    };

    const fruitKey = name.toLowerCase();
    return fruitEmojis[fruitKey] || "🍎";
  };

  const getCalorieColor = (calories: number) => {
    if (calories < 50) return theme.colors.tertiary;
    if (calories < 80) return theme.colors.primary;
    return theme.colors.secondary;
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={cardAnimatedStyle}
    >
      <AnimatedCard
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        elevation={2}
      >
        <Card.Content style={styles.content}>
          {/* Header con emoji y nombre */}
          <AnimatedSurface
            style={[
              styles.header,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
            elevation={1}
          >
            <Text style={styles.emoji}>{getFruitEmoji(fruit.name)}</Text>
            <Text
              variant="titleLarge"
              style={[
                styles.fruitName,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {fruit.name}
            </Text>
          </AnimatedSurface>

          {/* Información taxonómica */}
          <Surface
            style={[
              styles.taxonomySection,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            elevation={0}
          >
            <Text
              variant="bodySmall"
              style={[
                styles.sectionTitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Clasificación
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              <Text style={{ fontWeight: "bold" }}>Familia:</Text>{" "}
              {fruit.family}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              <Text style={{ fontWeight: "bold" }}>Género:</Text> {fruit.genus}
            </Text>
          </Surface>

          {/* Información nutricional */}
          <Surface
            style={[
              styles.nutritionSection,
              { backgroundColor: theme.colors.secondaryContainer },
            ]}
            elevation={1}
          >
            <Text
              variant="bodySmall"
              style={[
                styles.sectionTitle,
                { color: theme.colors.onSecondaryContainer },
              ]}
            >
              Información Nutricional
            </Text>

            <Animated.View
              style={[styles.nutritionGrid, nutritionItemAnimatedStyle]}
            >
              <Surface
                style={[
                  styles.nutritionItem,
                  {
                    backgroundColor: getCalorieColor(fruit.nutritions.calories),
                  },
                ]}
                elevation={1}
              >
                <IconSymbol
                  name="flame"
                  size={16}
                  color={theme.colors.onPrimary}
                />
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onPrimary, fontWeight: "bold" }}
                >
                  {fruit.nutritions.calories} cal
                </Text>
              </Surface>

              <Surface
                style={[
                  styles.nutritionItem,
                  { backgroundColor: theme.colors.tertiary },
                ]}
                elevation={1}
              >
                <IconSymbol
                  name="cube.box"
                  size={16}
                  color={theme.colors.onTertiary}
                />
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onTertiary, fontWeight: "bold" }}
                >
                  {fruit.nutritions.carbohydrates}g carb
                </Text>
              </Surface>

              <Surface
                style={[
                  styles.nutritionItem,
                  { backgroundColor: theme.colors.error },
                ]}
                elevation={1}
              >
                <IconSymbol
                  name="heart"
                  size={16}
                  color={theme.colors.onError}
                />
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onError, fontWeight: "bold" }}
                >
                  {fruit.nutritions.sugar}g azúcar
                </Text>
              </Surface>

              <Surface
                style={[
                  styles.nutritionItem,
                  { backgroundColor: theme.colors.outline },
                ]}
                elevation={1}
              >
                <IconSymbol
                  name="dumbbell"
                  size={16}
                  color={theme.colors.surface}
                />
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.surface, fontWeight: "bold" }}
                >
                  {fruit.nutritions.protein}g prot
                </Text>
              </Surface>
            </Animated.View>
          </Surface>

          {/* Footer con ID */}
          <Chip
            style={[
              styles.idChip,
              { backgroundColor: theme.colors.tertiaryContainer },
            ]}
            textStyle={{ color: theme.colors.onTertiaryContainer }}
          >
            ID: {fruit.id}
          </Chip>
        </Card.Content>
      </AnimatedCard>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  fruitName: {
    fontWeight: "bold",
    flex: 1,
  },
  taxonomySection: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  nutritionSection: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  nutritionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  idChip: {
    alignSelf: "flex-start",
  },
});
