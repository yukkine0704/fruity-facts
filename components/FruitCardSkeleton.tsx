import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
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
    // Animación de entrada
    const delay = index * 100;

    scaleAnimation.value = withDelay(
      delay,
      withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      })
    );

    opacityAnimation.value = withDelay(delay, withTiming(1, { duration: 600 }));

    // Animación de shimmer
    shimmerAnimation.value = withDelay(
      delay + 200,
      withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),

        -1,
        true
      )
    );
  }, [index]);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnimation.value }],
      opacity: opacityAnimation.value,
    };
  });

  const SkeletonBox: React.FC<{
    width: number | string;
    height: number;
    style?: any;

    delay?: number;
  }> = ({ width, height, style, delay = 0 }) => {
    const shimmerStyle = useAnimatedStyle(() => {
      const shimmerOpacity = interpolate(
        shimmerAnimation.value,
        [0, 0.5, 1],
        [0.3, 0.7, 0.3]
      );

      const shimmerTranslateX = interpolate(
        shimmerAnimation.value,
        [0, 1],
        [-100, 100]
      );

      return {
        opacity: shimmerOpacity,
        transform: [{ translateX: shimmerTranslateX }],
      };
    });

    return (
      <Animated.View
        style={[
          {
            width,
            height,
            backgroundColor: theme.colors.outline,
            borderRadius: 8,
            overflow: "hidden",
          },
          style,
        ]}
      >
        <Animated.View
          style={[
            {
              width: "100%",
              height: "100%",
              backgroundColor: theme.colors.surface,
            },
            shimmerStyle,
          ]}
        />
      </Animated.View>
    );
  };

  return (
    <AnimatedCard
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface },
        cardAnimatedStyle,
      ]}
      elevation={2}
    >
      <Card.Content style={styles.content}>
        {/* Header Skeleton */}
        <Surface
          style={[
            styles.header,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          elevation={1}
        >
          <SkeletonBox width={40} height={40} style={{ borderRadius: 20 }} />
          <SkeletonBox
            width="70%"
            height={24}
            style={{ marginLeft: 12 }}
            delay={100}
          />
        </Surface>

        {/* Taxonomy Section Skeleton */}
        <Surface
          style={[
            styles.taxonomySection,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          elevation={0}
        >
          <SkeletonBox
            width="40%"
            height={12}
            style={{ marginBottom: 8 }}
            delay={200}
          />
          <SkeletonBox
            width="80%"
            height={16}
            style={{ marginBottom: 4 }}
            delay={300}
          />
          <SkeletonBox width="75%" height={16} delay={400} />
        </Surface>

        {/* Nutrition Section Skeleton */}
        <Surface
          style={[
            styles.nutritionSection,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          elevation={1}
        >
          <SkeletonBox
            width="60%"
            height={12}
            style={{ marginBottom: 8 }}
            delay={500}
          />
          <Surface style={styles.nutritionGrid} elevation={0}>
            <SkeletonBox
              width={80}
              height={28}
              style={{ borderRadius: 14 }}
              delay={600}
            />
            <SkeletonBox
              width={90}
              height={28}
              style={{ borderRadius: 14 }}
              delay={700}
            />
            <SkeletonBox
              width={85}
              height={28}
              style={{ borderRadius: 14 }}
              delay={800}
            />
            <SkeletonBox
              width={75}
              height={28}
              style={{ borderRadius: 14 }}
              delay={900}
            />
          </Surface>
        </Surface>

        {/* ID Chip Skeleton */}
        <SkeletonBox
          width={60}
          height={32}
          style={{ borderRadius: 16 }}
          delay={1000}
        />
      </Card.Content>
    </AnimatedCard>
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
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "transparent",
  },
});
