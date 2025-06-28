import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

// Definimos los tipos para las props
interface AppHeaderProps {
  title?: string;
  leftAction?: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap; // Permite cualquier icono de MaterialCommunityIcons
    onPress: () => void;
    accessibilityLabel?: string;
  };
  rightAction?: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    onPress: () => void;
    accessibilityLabel?: string;
  };
  containerStyle?: StyleProp<ViewStyle>; // Para estilos adicionales en el contenedor
  titleStyle?: StyleProp<TextStyle>; // Para estilos adicionales en el título
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  leftAction,
  rightAction,
  containerStyle,
  titleStyle,
}) => {
  const { theme } = useTheme();
  const AnimatedText = Animated.createAnimatedComponent(Text);

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          backgroundColor: theme.colors.surface, // Color de fondo del header
          borderBottomColor: theme.colors.outlineVariant, // Borde sutil en la parte inferior
        },
        containerStyle, // Aplica estilos personalizados si se proporcionan
      ]}
      entering={FadeIn.delay(100).duration(500)} // Animación de entrada suave
      layout={Layout.springify()} // Animación de layout para cambios de tamaño o posición
    >
      {/* Sección izquierda (acción opcional) */}
      <View style={styles.actionContainer}>
        {leftAction && (
          <AnimatedPressable
            onPress={leftAction.onPress}
            accessibilityLabel={
              leftAction.accessibilityLabel || "Left action button"
            }
            style={({ pressed }) => [
              styles.iconButton,
              { opacity: pressed ? 0.6 : 1 }, // Efecto de press
            ]}
            entering={FadeIn} // Animación de entrada si aparece el botón
            exiting={FadeOut} // Animación de salida si desaparece
          >
            <MaterialCommunityIcons
              name={leftAction.icon}
              size={24}
              color={theme.colors.onSurface} // Color del icono
            />
          </AnimatedPressable>
        )}
      </View>

      {/* Título central (opcional) */}
      <View style={styles.titleContainer}>
        {title && (
          <AnimatedText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.title,
              { color: theme.colors.onSurface }, // Color del título
              titleStyle, // Aplica estilos personalizados al título
            ]}
            entering={FadeIn} // Animación de entrada
            exiting={FadeOut} // Animación de salida
            layout={Layout.springify()}
          >
            {title}
          </AnimatedText>
        )}
      </View>

      {/* Sección derecha (acción opcional) */}
      <View style={styles.actionContainer}>
        {rightAction && (
          <AnimatedPressable
            onPress={rightAction.onPress}
            accessibilityLabel={
              rightAction.accessibilityLabel || "Right action button"
            }
            style={({ pressed }) => [
              styles.iconButton,
              { opacity: pressed ? 0.6 : 1 }, // Efecto de press
            ]}
            entering={FadeIn} // Animación de entrada
            exiting={FadeOut} // Animación de salida
          >
            <MaterialCommunityIcons
              name={rightAction.icon}
              size={24}
              color={theme.colors.onSurface} // Color del icono
            />
          </AnimatedPressable>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12, // Espaciado vertical adecuado para Material Design
    height: 64, // Altura estándar de un AppBar en Material Design
    borderBottomWidth: StyleSheet.hairlineWidth, // Borde fino en la parte inferior
    // La sombra (elevation) se puede añadir si lo deseas, pero los headers de Material Design 3 suelen ser flat por defecto.
    // Para sombra:
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 2,
  },
  actionContainer: {
    width: 48, // Un tamaño fijo para los contenedores de acción (para alineación)
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    padding: 8, // Área de toque más grande para el icono
    borderRadius: 24, // Para un efecto de círculo al presionar
  },
  titleContainer: {
    flex: 1, // Permite que el título ocupe el espacio restante
    alignItems: "center", // Centra el título horizontalmente
    justifyContent: "center",
    marginHorizontal: 8, // Margen para que no toque los botones
  },
  title: {
    textAlign: "center", // Asegura que el texto esté centrado si hay varias líneas
  },
});
