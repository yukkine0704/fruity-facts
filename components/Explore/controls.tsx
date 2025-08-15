// src/components/ExploreControls.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/hexConverter";
import { BlurView } from "expo-blur";
import { SlidersHorizontal } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Searchbar, Surface } from "react-native-paper";

type SortBy = "name" | "calories" | "protein";

interface ExploreControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortBy;
  onSortPress: () => void;
  isSticky: boolean;
}

export function ExploreControls({
  searchQuery,
  setSearchQuery,
  onSortPress,
  isSticky,
}: ExploreControlsProps) {
  const { theme } = useTheme();

  const renderContent = () => (
    <View style={styles.searchContainer}>
      <Searchbar
        placeholder="Buscar..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[
          styles.searchbar,
          {
            backgroundColor: isSticky
              ? theme.colors.surface
              : theme.colors.surfaceContainerHigh,
          },
        ]}
        inputStyle={{ color: theme.colors.onSurface }}
        iconColor={theme.colors.onSurfaceVariant}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
      <IconButton
        icon={() => (
          <SlidersHorizontal size={24} stroke={theme.colors.onSurface} />
        )}
        size={24}
        onPress={onSortPress}
        style={styles.sortIconButton}
      />
    </View>
  );

  if (isSticky) {
    return (
      <Surface
        style={[
          styles.stickyContainer,
          {
            backgroundColor: hexToRgba(theme.colors.surface, 0.55),
          },
        ]}
        elevation={theme.dark ? 2 : 3}
      >
        <BlurView
          intensity={20}
          tint={theme.dark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
        {renderContent()}
      </Surface>
    );
  }

  return renderContent();
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchbar: {
    flex: 1,
    borderRadius: 28,
    height: 56,
    elevation: 0,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  sortIconButton: {
    backgroundColor: "transparent",
    borderRadius: 28,
  },
  stickyContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
});
