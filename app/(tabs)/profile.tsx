import { useTheme } from "@/contexts/ThemeContext";
import { useUserStore } from "@/stores/userStore";
import React, { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Divider,
  List,
  Portal,
  Snackbar,
  Surface,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [tempName, setTempName] = useState("");

  const { user, updateUserName, getUserStats, clearUserData, exportUserData } =
    useUserStore();

  const stats = getUserStats();

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    showMessage(`Tema ${!isDarkMode ? "oscuro" : "claro"} activado`);
  };

  const handleNameChange = () => {
    setTempName(user?.name || "");
    setShowNameDialog(true);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateUserName(tempName.trim());
      showMessage("Nombre actualizado");
    }
    setShowNameDialog(false);
  };

  const handleExportData = async () => {
    try {
      const data = await exportUserData();
      showMessage("Datos exportados exitosamente");
      // Aquí podrías implementar compartir el archivo
    } catch (error) {
      showMessage("Error al exportar datos");
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Limpiar datos",
      "¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            clearUserData();
            showMessage("Datos eliminados");
          },
        },
      ]
    );
  };

  const handleOpenGitHub = () => {
    Linking.openURL("https://github.com/yukkine0704/fruity-facts");
  };

  const handleOpenUSDA = () => {
    Linking.openURL("https://fdc.nal.usda.gov/");
  };

  const handleSendFeedback = () => {
    Linking.openURL(
      "mailto:lubbok0704@gmail.com?subject=Fruity Facts Feedback"
    );
  };

  const renderHeader = () => (
    <Surface
      style={[
        styles.header,
        { backgroundColor: theme.colors.secondaryContainer },
      ]}
      elevation={3}
    >
      <Avatar.Icon
        size={80}
        icon="account"
        style={[styles.avatar, { backgroundColor: theme.colors.secondary }]}
      />
      <Text
        variant="headlineMedium"
        style={[styles.userName, { color: theme.colors.onSecondaryContainer }]}
      >
        {user?.name || "Usuario"}
      </Text>
      <Text
        variant="bodyMedium"
        style={[
          styles.userSubtitle,
          { color: theme.colors.onSecondaryContainer },
        ]}
      >
        Miembro desde{" "}
        {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "hoy"}
      </Text>

      <Button
        mode="outlined"
        onPress={handleNameChange}
        icon="pencil"
        style={[
          styles.editButton,
          { borderColor: theme.colors.onSecondaryContainer },
        ]}
        labelStyle={{ color: theme.colors.onSecondaryContainer }}
      >
        Editar perfil
      </Button>
    </Surface>
  );

  const renderStats = () => (
    <Card style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          📊 Estadísticas
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
            >
              {stats.totalFruitsViewed}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
              Frutas vistas
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.secondary, fontWeight: "bold" }}
            >
              {stats.totalFavorites}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
              Favoritos
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.tertiary, fontWeight: "bold" }}
            >
              {stats.totalSearches}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
              Búsquedas
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
            >
              {stats.daysActive}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
              Días activo
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSettings = () => (
    <Card
      style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}
    >
      <Card.Content>
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          ⚙️ Configuración
        </Text>

        <List.Item
          title="Tema oscuro"
          description="Cambiar entre tema claro y oscuro"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              color={theme.colors.primary}
            />
          )}
        />

        <Divider style={{ marginVertical: 8 }} />

        <List.Item
          title="Notificaciones"
          description="Recibir notificaciones de la app"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={false}
              onValueChange={() => showMessage("Próximamente disponible")}
              color={theme.colors.primary}
            />
          )}
        />

        <Divider style={{ marginVertical: 8 }} />

        <List.Item
          title="Búsqueda automática"
          description="Buscar automáticamente al escribir"
          left={(props) => <List.Icon {...props} icon="magnify-scan" />}
          right={() => (
            <Switch
              value={true}
              onValueChange={() => showMessage("Próximamente disponible")}
              color={theme.colors.primary}
            />
          )}
        />
      </Card.Content>
    </Card>
  );

  const renderDataSection = () => (
    <Card style={[styles.dataCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          💾 Datos
        </Text>

        <List.Item
          title="Exportar datos"
          description="Descargar todos tus datos"
          left={(props) => <List.Icon {...props} icon="download" />}
          onPress={handleExportData}
        />

        <Divider style={{ marginVertical: 8 }} />

        <List.Item
          title="Limpiar datos"
          description="Eliminar todos los datos guardados"
          left={(props) => <List.Icon {...props} icon="delete" />}
          titleStyle={{ color: theme.colors.error }}
          onPress={handleClearData}
        />
      </Card.Content>
    </Card>
  );

  const renderAboutSection = () => (
    <Card style={[styles.aboutCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          ℹ️ Acerca de
        </Text>

        <List.Item
          title="Código fuente"
          description="Ver el proyecto en GitHub"
          left={(props) => <List.Icon {...props} icon="github" />}
          onPress={handleOpenGitHub}
        />

        <Divider style={{ marginVertical: 8 }} />

        <List.Item
          title="Base de datos USDA"
          description="Fuente de datos nutricionales"
          left={(props) => <List.Icon {...props} icon="database" />}
          onPress={handleOpenUSDA}
        />

        <Divider style={{ marginVertical: 8 }} />

        <List.Item
          title="Enviar feedback"
          description="Comparte tu opinión"
          left={(props) => <List.Icon {...props} icon="email" />}
          onPress={handleSendFeedback}
        />

        <Divider style={{ marginVertical: 8 }} />

        <List.Item
          title="Versión"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
        />
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderStats()}
        {renderSettings()}
        {renderDataSection()}
        {renderAboutSection()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Dialog para cambiar nombre */}
      <Portal>
        <Dialog
          visible={showNameDialog}
          onDismiss={() => setShowNameDialog(false)}
        >
          <Dialog.Title>Cambiar nombre</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nombre"
              value={tempName}
              onChangeText={setTempName}
              mode="outlined"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowNameDialog(false)}>Cancelar</Button>
            <Button onPress={handleSaveName}>Guardar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.inverseSurface }}
        action={{
          label: "OK",
          onPress: () => setShowSnackbar(false),
        }}
      >
        <Text style={{ color: theme.colors.inverseOnSurface }}>
          {snackbarMessage}
        </Text>
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  avatar: {
    marginBottom: 16,
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  userSubtitle: {
    marginBottom: 16,
    opacity: 0.8,
  },
  editButton: {
    borderRadius: 20,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  dataCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  aboutCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    minWidth: "45%",
  },
  bottomSpacing: {
    height: 32,
  },
});
