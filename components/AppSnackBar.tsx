import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Snackbar, Text, useTheme } from "react-native-paper";

interface AppSnackbarProps {
  visible: boolean;
  onDismiss: () => void;
  message: string;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export const AppSnackbar: React.FC<AppSnackbarProps> = ({
  visible,
  onDismiss,
  message,
  duration = 3000,
  style,
}) => {
  const theme = useTheme();

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      style={[{ backgroundColor: theme.colors.inverseSurface }, style]}
      action={{
        label: "OK",
        onPress: onDismiss,
        textColor: theme.colors.inversePrimary,
      }}
    >
      <Text style={{ color: theme.colors.inverseOnSurface }}>{message}</Text>
    </Snackbar>
  );
};
