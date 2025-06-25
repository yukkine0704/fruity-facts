import FruitDetailsScreen from "@/app/fruit-details[fruitName]";
import { useTheme } from "@/contexts/ThemeContext";
import { ExploreStackParamList } from "@/types/navigation";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ExploreScreen from "../explore";

const Stack = createStackNavigator<ExploreStackParamList>();

export default function ExploreStack() {
  const { theme } = useTheme();

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
        options={({ route }) => ({
          title: route.params?.fruitName || "Detalles",
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
}
