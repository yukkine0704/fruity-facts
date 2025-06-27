import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Platform, Pressable, StatusBar, StyleSheet, View } from "react-native";
import { BottomNavigation, IconButton, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
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
    // Animación de entrada del dock
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
      transform: [{ scale: dockScale.value }],
      opacity: dockOpacity.value,
    };
  });

  const CustomTabBar = () => {
    return (
      <Animated.View style={[styles.dockContainer, dockAnimatedStyle]}>
        <View style={[styles.dock, { backgroundColor: theme.colors.surface }]}>
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
      </Animated.View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background, // Fondo dinámico
    },
    content: {
      flex: 1,
      backgroundColor: theme.colors.background, // Asegurar fondo consistente
      paddingBottom: 100, // Espacio para el dock
    },
    dockContainer: {
      position: "absolute",
      bottom: insets.bottom + 16,
      left: 16,
      right: 16,
      alignItems: "center",
    },
    dock: {
      flexDirection: "row",
      paddingHorizontal: 8,
      paddingVertical: 12,
      borderRadius: 28,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 16,
      borderWidth: 1,
      borderColor: theme.colors.outline + "15",
      backgroundColor: theme.colors.surface,
      ...Platform.select({
        ios: {
          backdropFilter: "blur(20px)",
        },
      }),
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
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <View style={styles.content}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={{ display: "none" }}
        />
      </View>
      <CustomTabBar />
    </View>
  );
}
