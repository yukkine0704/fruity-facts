// src/components/ExploreHeader.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { Home, RefreshCcw } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

interface ExploreHeaderProps {
  onRefresh: () => void;
}

export function ExploreHeader({ onRefresh }: ExploreHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.headerContainer}>
      {/* Sección Izquierda: Saludo y Título */}
      <View style={styles.leftContainer}>
        <Home size={24} color={theme.colors.onBackground} />
        <View>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.onBackground,
              fontWeight: "bold",
            }}
          >
            Fruity Facts
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Descubre las frutas
          </Text>
        </View>
      </View>

      {/* Sección Derecha: Botón de Refrescar */}
      <TouchableOpacity
        onPress={onRefresh}
        style={[
          styles.refreshButton,
          {
            backgroundColor: theme.colors.primaryContainer,
          },
        ]}
      >
        <RefreshCcw size={20} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
