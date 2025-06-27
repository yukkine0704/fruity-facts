import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Dialog,
  List,
  Portal,
  RadioButton,
  Text,
} from "react-native-paper";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  description: string;
  icon: string;
};

const themeOptions: ThemeOption[] = [
  {
    value: "system",
    label: "Automático",
    description: "Sigue la configuración del sistema",
    icon: "theme-light-dark",
  },
  {
    value: "light",
    label: "Claro",
    description: "Tema claro siempre activo",
    icon: "white-balance-sunny",
  },
  {
    value: "dark",
    label: "Oscuro",
    description: "Tema oscuro siempre activo",
    icon: "moon-waning-crescent",
  },
];

interface ThemeSelectorProps {
  showAsCard?: boolean;
  showDialog?: boolean;
  onDialogDismiss?: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  showAsCard = false,
  showDialog = false,
  onDialogDismiss,
}) => {
  const {
    theme,
    themeMode,
    setThemeMode,
    getThemeDisplayName,
    getThemeIcon,
    systemColorScheme,
  } = useTheme();

  const [dialogVisible, setDialogVisible] = useState(showDialog);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setThemeMode(newTheme);
    if (showDialog) {
      setDialogVisible(false);
      onDialogDismiss?.();
    }
  };

  const renderThemeOptions = () => (
    <View style={styles.optionsContainer}>
      <RadioButton.Group
        onValueChange={(value) =>
          handleThemeChange(value as "light" | "dark" | "system")
        }
        value={themeMode}
      >
        {themeOptions.map((option) => (
          <View key={option.value} style={styles.optionItem}>
            <List.Item
              title={option.label}
              description={
                option.value === "system"
                  ? `${option.description} (${
                      systemColorScheme === "dark" ? "Oscuro" : "Claro"
                    })`
                  : option.description
              }
              left={(props) => <List.Icon {...props} icon={option.icon} />}
              right={() => (
                <RadioButton
                  value={option.value}
                  color={theme.colors.primary}
                />
              )}
              onPress={() => handleThemeChange(option.value)}
              style={[
                styles.listItem,
                themeMode === option.value && {
                  backgroundColor: theme.colors.primaryContainer,
                },
              ]}
              titleStyle={
                themeMode === option.value && {
                  color: theme.colors.onPrimaryContainer,
                  fontWeight: "bold",
                }
              }
              descriptionStyle={
                themeMode === option.value && {
                  color: theme.colors.onPrimaryContainer,
                }
              }
            />
          </View>
        ))}
      </RadioButton.Group>
    </View>
  );

  if (showDialog) {
    return (
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => {
            setDialogVisible(false);
            onDialogDismiss?.();
          }}
          style={styles.dialog}
        >
          <Dialog.Title>Seleccionar tema</Dialog.Title>
          <Dialog.Content>
            <Text
              variant="bodyMedium"
              style={[
                styles.dialogDescription,
                { color: theme.colors.onSurface },
              ]}
            >
              Elige cómo quieres que se vea la aplicación
            </Text>
            {renderThemeOptions()}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setDialogVisible(false);
                onDialogDismiss?.();
              }}
            >
              Cerrar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  if (showAsCard) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.cardTitle, { color: theme.colors.onSurface }]}
          >
            🎨 Apariencia
          </Text>
          <Text
            variant="bodySmall"
            style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}
          >
            Tema actual: {getThemeDisplayName}
          </Text>
          {renderThemeOptions()}
        </Card.Content>
      </Card>
    );
  }
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
  },
  dialogDescription: {
    marginBottom: 16,
    opacity: 0.8,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    marginBottom: 16,
    opacity: 0.7,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionItem: {
    marginBottom: 4,
  },
  listItem: {
    borderRadius: 8,
    marginVertical: 2,
  },
});
