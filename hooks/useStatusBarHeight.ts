import { Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useStatusBarHeight() {
  const insets = useSafeAreaInsets();

  if (Platform.OS === "ios") {
    return insets.top;
  }

  return StatusBar.currentHeight || 24;
}
