import FruitDetailsScreen from "@/app/FruitDetailsScreen";
import { useTheme } from "@/contexts/ThemeContext";
import { ExploreStackParamList } from "@/types/navigation";
import { createStackNavigator } from "@react-navigation/stack";
import { useRouter } from "expo-router";
import React from "react";
import ExploreScreen from "../explore";

const Stack = createStackNavigator<ExploreStackParamList>();

export default function ExploreStack() {
  const { theme } = useTheme();
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleRefreshPress = () => {
    console.log("Refresh pressed");
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: false,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ExploreMain"
        component={ExploreScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FruitDetails"
        component={FruitDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
