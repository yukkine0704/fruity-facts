import React from "react";
import { View } from "react-native";
import { FruitCardSkeleton } from "./FruitCardSkeleton";

interface FruitListSkeletonProps {
  count?: number;
}

export const FruitListSkeleton: React.FC<FruitListSkeletonProps> = ({
  count = 6,
}) => {
  return (
    <View>
      {Array.from({ length: count }, (_, index) => (
        <FruitCardSkeleton key={`skeleton-${index}`} index={index} />
      ))}
    </View>
  );
};
