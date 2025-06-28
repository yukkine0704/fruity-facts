import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/hexConverter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Definimos los tipos para las props
interface AppHeaderProps {
  title?: string;
  leftAction?: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    onPress: () => void;
    accessibilityLabel?: string;
  };
  rightAction?: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    onPress: () => void;
    accessibilityLabel?: string;
  };
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  blurIntensity?: number;
  enableBlur?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  leftAction,
  rightAction,
  containerStyle,
  titleStyle,
  blurIntensity = 20,
  enableBlur = true,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const AnimatedText = Animated.createAnimatedComponent(Text);

  // Determinar el tint del blur basado en el tema
  const blurTint = theme.dark ? "dark" : "light";

  // Color de fondo semi-transparente para el blur
  const blurBackgroundColor = hexToRgba(theme.colors.surface, 0.8);

  const HeaderContent = () => (
    <>
      {/* Sección izquierda (acción opcional) */}
      <Animated.View style={styles.actionContainer}>
        {leftAction && (
          <AnimatedPressable
            onPress={leftAction.onPress}
            accessibilityLabel={
              leftAction.accessibilityLabel || "Left action button"
            }
            style={({ pressed }) => [
              styles.iconButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <MaterialCommunityIcons
              name={leftAction.icon}
              size={24}
              color={theme.colors.onSurface}
            />
          </AnimatedPressable>
        )}
      </Animated.View>

      {/* Título central (opcional) */}
      <Animated.View style={styles.titleContainer}>
        {title && (
          <AnimatedText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.title,
              { color: theme.colors.onSurface },
              titleStyle,
            ]}
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout.springify()}
          >
            {title}
          </AnimatedText>
        )}
      </Animated.View>

      {/* Sección derecha (acción opcional) */}
      <Animated.View style={styles.actionContainer}>
        {rightAction && (
          <AnimatedPressable
            onPress={rightAction.onPress}
            accessibilityLabel={
              rightAction.accessibilityLabel || "Right action button"
            }
            style={({ pressed }) => [
              styles.iconButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <MaterialCommunityIcons
              name={rightAction.icon}
              size={24}
              color={theme.colors.onSurface}
            />
          </AnimatedPressable>
        )}
      </Animated.View>
    </>
  );

  if (enableBlur) {
    return (
      <Animated.View
        style={[
          styles.headerContainer,
          {
            paddingTop: insets.top,
            height: 64 + insets.top,
          },
          containerStyle,
        ]}
        entering={FadeIn.delay(100).duration(500)}
        layout={Layout.springify()}
      >
        <BlurView
          intensity={blurIntensity}
          tint={blurTint}
          style={[
            styles.blurBackground,
            {
              backgroundColor: blurBackgroundColor,
            },
          ]}
          experimentalBlurMethod="dimezisBlurView"
        >
          <Animated.View
            style={[
              styles.headerContent,
              {
                paddingTop: insets.top > 0 ? 8 : 12,
                paddingBottom: 12,
              },
            ]}
          >
            <HeaderContent />
          </Animated.View>
        </BlurView>
      </Animated.View>
    );
  }

  // Fallback sin blur (comportamiento original)
  return (
    <Animated.View
      style={[
        styles.headerContainer,
        styles.solidBackground,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.outlineVariant,
          paddingTop: insets.top,
          height: 64 + insets.top,
        },
        containerStyle,
      ]}
      entering={FadeIn.delay(100).duration(500)}
      layout={Layout.springify()}
    >
      <Animated.View
        style={[
          styles.headerContent,
          {
            paddingTop: insets.top > 0 ? 8 : 12,
            paddingBottom: 12,
          },
        ]}
      >
        <HeaderContent />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    // Sombra para el header
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  solidBackground: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  blurBackground: {
    flex: 1,
    overflow: "hidden",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  actionContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
