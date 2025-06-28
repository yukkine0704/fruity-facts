import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/hexConverter";
import { BlurView } from "expo-blur";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring, // Asegúrate de que withSpring esté importado
  withTiming, // Asegúrate de que withTiming esté importado
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = React.lazy(() => import("./index"));
const ExploreScreen = React.lazy(() => import("./explore"));
const FavoritesScreen = React.lazy(() => import("./favorites"));
const ProfileScreen = React.lazy(() => import("./profile"));

const MemoizedHomeScreen = React.memo(HomeScreen);
const MemoizedExploreScreen = React.memo(ExploreScreen);
const MemoizedFavoritesScreen = React.memo(FavoritesScreen);
const MemoizedProfileScreen = React.memo(ProfileScreen);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TabLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);

  // Animaciones
  const dockScale = useSharedValue(1);
  const dockOpacity = useSharedValue(1);

  const translateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  // Altura de la barra. Ajusta este valor si tu barra es más alta o más baja.
  // Es importante que sea precisa para la animación de ocultar.
  const BAR_HEIGHT = 90 + insets.bottom;

  const routes = [
    {
      key: "home",
      title: "Inicio",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "explore",
      title: "Explorar",
      focusedIcon: "compass",
      unfocusedIcon: "compass-outline",
    },
    {
      key: "favorites",
      title: "Favoritos",
      focusedIcon: "heart",
      unfocusedIcon: "heart-outline",
    },
    {
      key: "profile",
      title: "Perfil",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ];

  const renderScene = React.useCallback(({ route }: { route: any }) => {
    switch (route.key) {
      case "home":
        return <MemoizedHomeScreen />;
      case "explore":
        return <MemoizedExploreScreen />;
      case "favorites":
        return <MemoizedFavoritesScreen />;
      case "profile":
        return <MemoizedProfileScreen />;
      default:
        return null;
    }
  }, []);

  React.useEffect(() => {
    // Animación de entrada inicial del dock.
    // Usamos withSpring aquí también para que al cargar la app, la barra "rebote" un poco.
    dockScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    dockOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  const handleTabPress = (tabIndex: number) => {
    // Animación de feedback
    dockScale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
    setTimeout(() => {
      dockScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }, 100);

    setIndex(tabIndex);
  };

  const dockAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: dockScale.value }, { translateY: translateY.value }],
      opacity: dockOpacity.value,
    };
  });

  // MODIFICADO: Función para manejar el evento de scroll con animación bouncy
  const handleScroll = React.useCallback(
    (event: any) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const scrollDelta = currentScrollY - lastScrollY.value;

      // Umbral de scroll para activar la ocultación
      const SCROLL_THRESHOLD = 20; // Cuántos píxeles debe desplazarse antes de ocultar/mostrar

      // Ocultar barra (scroll hacia abajo)
      if (scrollDelta > SCROLL_THRESHOLD && currentScrollY > BAR_HEIGHT) {
        translateY.value = withTiming(BAR_HEIGHT + insets.bottom + 16, {
          duration: 200,
        });
      }
      // Mostrar barra (scroll hacia arriba o al llegar al principio)
      else if (
        scrollDelta < -SCROLL_THRESHOLD ||
        currentScrollY <= BAR_HEIGHT
      ) {
        translateY.value = withSpring(0, {
          damping: 18, // Ajusta este valor para más o menos rebote
          stiffness: 120, // Ajusta este valor para la "rigidez" del rebote
          // Puedes agregar overshootClamping: true si quieres evitar que el rebote se extienda más allá del valor final.
          // Pero para un efecto "expressive", a veces un ligero overshoot es deseable.
        });
      }

      lastScrollY.value = currentScrollY;
    },
    [BAR_HEIGHT, insets.bottom]
  );

  const CustomTabBar = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const blurBackgroundColor = hexToRgba(theme.colors.surface, 0.7);

    return (
      <Animated.View
        style={[
          styles.dockContainer,
          dockAnimatedStyle,
          {
            shadowColor: theme.dark
              ? theme.colors.surface
              : theme.colors.primary,
          },
        ]}
      >
        <BlurView
          intensity={20}
          tint={theme.dark ? "dark" : "light"}
          style={[
            styles.blurDockBackground,
            {
              backgroundColor: blurBackgroundColor,
              borderColor: theme.colors.outline,
            },
          ]}
          experimentalBlurMethod="dimezisBlurView"
        >
          <View style={styles.solidDockContent}>
            {routes.map((route, tabIndex) => {
              const isActive = index === tabIndex;
              const tabScale = useSharedValue(1);

              const tabAnimatedStyle = useAnimatedStyle(() => {
                return {
                  transform: [{ scale: tabScale.value }],
                };
              });

              return (
                <AnimatedPressable
                  key={route.key}
                  style={[styles.tabItem, tabAnimatedStyle]}
                  onPress={() => handleTabPress(tabIndex)}
                  onPressIn={() => {
                    tabScale.value = withSpring(0.9, {
                      damping: 15,
                      stiffness: 200,
                    });
                  }}
                  onPressOut={() => {
                    tabScale.value = withSpring(1, {
                      damping: 15,
                      stiffness: 200,
                    });
                  }}
                >
                  <View
                    style={[
                      styles.tabIconContainer,
                      isActive && {
                        backgroundColor: theme.colors.primaryContainer,
                      },
                    ]}
                  >
                    <IconButton
                      icon={isActive ? route.focusedIcon : route.unfocusedIcon}
                      size={24}
                      iconColor={
                        isActive
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurfaceVariant
                      }
                      style={{ margin: 0 }}
                    />
                  </View>
                  {isActive && (
                    <Text
                      variant="labelSmall"
                      style={{
                        color: theme.colors.primary,
                        fontWeight: "600",
                        marginTop: 2,
                      }}
                    >
                      {route.title}
                    </Text>
                  )}
                </AnimatedPressable>
              );
            })}
          </View>
        </BlurView>
      </Animated.View>
    );
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        content: {
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingBottom: BAR_HEIGHT + 16,
        },
        dockContainer: {
          position: "absolute",
          bottom: insets.bottom + 16,
          left: 16,
          right: 16,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        blurDockBackground: {
          width: "100%",
          borderRadius: 28,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: theme.colors.outline,
          paddingHorizontal: 8,
          paddingVertical: 12,
        },
        solidDockContent: {
          flexDirection: "row",
          flex: 1,
        },
        solidDock: {
          flexDirection: "row",
          paddingHorizontal: 8,
          paddingVertical: 12,
          borderRadius: 28,
          borderWidth: 1,
          borderColor: theme.colors.outline + "15",
          backgroundColor: hexToRgba(theme.colors.surface, 0.75),
          overflow: "hidden",
          flex: 1,
        },
        tabItem: {
          flex: 1,
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 4,
        },
        tabIconContainer: {
          borderRadius: 20,
          padding: 4,
        },
        hiddenTabBar: {
          height: 0,
          overflow: "hidden",
          opacity: 0,
          backgroundColor: "transparent",
          position: "absolute",
          bottom: -1000,
        },
        bottomNavigation: {
          backgroundColor: "transparent",
        },
      }),
    [theme, insets, BAR_HEIGHT]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: BAR_HEIGHT + 16 }}
      >
        {renderScene({ route: routes[index] })}
      </ScrollView>

      <CustomTabBar />
    </View>
  );
}
