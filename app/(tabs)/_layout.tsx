import { useTheme } from "@/contexts/ThemeContext";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { BottomNavigation } from "react-native-paper";

const HomeScreen = React.lazy(() => import("./index"));
const ExploreStack = React.lazy(() => import("./explore/_layout"));

const MemoizedHomeScreen = React.memo(HomeScreen);
const MemoizedExploreStack = React.memo(ExploreStack);

const Stack = createStackNavigator();

export default function TabLayout() {
  const { theme } = useTheme();
  const [index, setIndex] = React.useState(0);

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
  ];

  const renderScene = React.useCallback(({ route }: { route: any }) => {
    switch (route.key) {
      case "home":
        return <MemoizedHomeScreen />;
      case "explore":
        return <MemoizedExploreStack />;
      default:
        return null;
    }
  }, []);

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
      barStyle={{
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.outline,
        borderTopWidth: 0.5,
      }}
      sceneAnimationType="shifting"
    />
  );
}
