// components/SearchSkeleton.tsx
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

interface SearchSkeletonProps {
  viewMode: "list" | "grid";
}

const SearchSkeleton = ({ viewMode }: SearchSkeletonProps) => {
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

  const renderSkeletonItems = () => {
    const numItems = viewMode === "list" ? 6 : 8; // Más ítems para la cuadrícula para llenar la pantalla
    const items = [...Array(numItems)].map((_, index) => (
      <Animated.View
        key={index}
        style={[
          viewMode === "list" ? styles.skeletonItem : styles.skeletonGridItem,
          animatedStyle,
        ]}
      />
    ));

    if (viewMode === "grid") {
      return <View style={styles.gridContainer}>{items}</View>;
    }

    return items;
  };

  return <View style={styles.container}>{renderSkeletonItems()}</View>;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  skeletonItem: {
    height: 60,
    width: "100%",
    borderRadius: 12,
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  skeletonGridItem: {
    width: "48%", // Aprox. 50% menos el espaciado
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
});

export default SearchSkeleton;
