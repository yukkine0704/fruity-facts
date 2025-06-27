import { ThemeSelector } from "@/components/ThemeSelector";
import { useTheme } from "@/contexts/ThemeContext";
import { useUserStore } from "@/stores/userStore";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Chip,
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
  const {
    theme,
    themeMode,
    setThemeMode,
    cycleTheme,
    getThemeDisplayName,
    getThemeIcon,
    isDarkMode,
    systemColorScheme,
  } = useTheme();

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [tempName, setTempName] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const { user, updateUserName, getUserStats, clearUserData, exportUserData } =
    useUserStore();

  const stats = useMemo(() => getUserStats(), [getUserStats, user]);

  const showMessage = useCallback((message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  }, []);

  const handleThemePress = useCallback(() => {
    setShowThemeDialog(true);
  }, []);

  const handleQuickThemeToggle = useCallback(() => {
    cycleTheme();
    showMessage(`Tema cambiado a: ${getThemeDisplayName}`);
  }, [cycleTheme, showMessage, getThemeDisplayName]);

  const handleNameChange = useCallback(() => {
    setTempName(user?.name || "");
    setShowNameDialog(true);
  }, [user?.name]);

  const handleSaveName = useCallback(() => {
    if (tempName.trim()) {
      updateUserName(tempName.trim());
      showMessage("Nombre actualizado");
    }
    setShowNameDialog(false);
  }, [tempName, updateUserName, showMessage]);

  const handleExportData = useCallback(async () => {
    setIsExporting(true);
    try {
      const data = await exportUserData();
      showMessage("Datos exportados exitosamente");
    } catch (error) {
      console.error("Error al exportar datos:", error);
      showMessage("Error al exportar datos");
    } finally {
      setIsExporting(false);
    }
  }, [exportUserData, showMessage]);

  const handleClearData = useCallback(() => {
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
  }, [clearUserData, showMessage]);

  const handleOpenGitHub = useCallback(() => {
    Linking.openURL("https://github.com/yukkine0704/fruity-facts").catch(
      (err) => console.error("No se pudo abrir GitHub:", err)
    );
  }, []);

  const handleOpenUSDA = useCallback(() => {
    Linking.openURL("https://fdc.nal.usda.gov/").catch((err) =>
      console.error("No se pudo abrir USDA:", err)
    );
  }, []);

  const handleSendFeedback = useCallback(() => {
    Linking.openURL(
      "mailto:lubbok0704@gmail.com?subject=Fruity Facts Feedback"
    ).catch((err) => console.error("No se pudo abrir el correo:", err));
  }, []);

  // --- Componentes renderizados como funciones para una mejor organización ---

  const renderHeader = () => (
    <Surface
      style={[
        styles.header,
        {
          backgroundColor: theme.colors.primaryContainer,
          borderBottomLeftRadius: 36,
          borderBottomRightRadius: 36,
        },
      ]}
      elevation={4}
    >
      <Avatar.Icon
        size={96}
        icon="account-circle-outline"
        style={[styles.avatar, { backgroundColor: theme.colors.secondary }]}
        color={theme.colors.onSecondary}
      />
      <Text
        variant="headlineLarge"
        style={[styles.userName, { color: theme.colors.onPrimaryContainer }]}
      >
        {user?.name || "Usuario"}
      </Text>
      <Text
        variant="bodyLarge"
        style={[
          styles.userSubtitle,
          { color: theme.colors.onPrimaryContainer, opacity: 0.7 },
        ]}
      >
        Miembro desde{" "}
        {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "hoy"}
      </Text>

      <Chip
        icon={getThemeIcon}
        style={[
          styles.themeChip,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
        textStyle={{ color: theme.colors.onSurfaceVariant }}
        children={getThemeDisplayName}
        compact
        disabled
      />

      <Button
        mode="contained-tonal"
        onPress={handleNameChange}
        icon="pencil"
        style={styles.editButton}
      >
        Editar perfil
      </Button>
    </Surface>
  );

  const renderStats = () => (
    <Card
      style={[
        styles.statsCard,
        { backgroundColor: theme.colors.surfaceContainerHigh },
      ]}
    >
      <Card.Content>
        <Text
          variant="titleLarge"
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          <List.Icon icon="chart-bar" style={styles.sectionIcon} />
          Estadísticas {/* Ícono */}
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text
              variant="displaySmall"
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
            >
              {stats.totalFruitsViewed}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Frutas vistas
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              variant="displaySmall"
              style={{ color: theme.colors.secondary, fontWeight: "bold" }}
            >
              {stats.totalFavorites}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Favoritos
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              variant="displaySmall"
              style={{ color: theme.colors.tertiary, fontWeight: "bold" }}
            >
              {stats.totalSearches}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Búsquedas
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              variant="displaySmall"
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
            >
              {stats.daysActive}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Días activo
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSettings = () => (
    <Card
      style={[
        styles.settingsCard,
        { backgroundColor: theme.colors.surfaceContainerHigh },
      ]}
    >
      <Card.Content>
        <Text
          variant="titleLarge"
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          <List.Icon icon="cog" style={styles.sectionIcon} /> Configuración{" "}
          {/* Ícono */}
        </Text>

        <List.Item
          title="Apariencia"
          description={`Tema actual: ${getThemeDisplayName}${
            themeMode === "system"
              ? ` (${systemColorScheme === "dark" ? "Oscuro" : "Claro"})`
              : ""
          }`}
          left={(props) => <List.Icon {...props} icon={getThemeIcon} />}
          right={(props) => (
            <View style={styles.themeControls}>
              <Button
                mode="contained-tonal"
                compact
                onPress={handleQuickThemeToggle}
                style={styles.quickToggleButton}
              >
                Cambiar
              </Button>
              <List.Icon {...props} icon="chevron-right" />
            </View>
          )}
          onPress={handleThemePress}
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              borderRadius: 12,
            },
          ]}
          titleStyle={{ paddingVertical: 4 }}
          descriptionStyle={{ paddingBottom: 4 }}
        />

        <Divider
          style={{
            marginVertical: 8,
            backgroundColor: theme.colors.outlineVariant,
          }}
        />

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
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              borderRadius: 12,
            },
          ]}
          titleStyle={{ paddingVertical: 4 }}
          descriptionStyle={{ paddingBottom: 4 }}
        />

        <Divider
          style={{
            marginVertical: 8,
            backgroundColor: theme.colors.outlineVariant,
          }}
        />

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
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              borderRadius: 12,
            },
          ]}
          titleStyle={{ paddingVertical: 4 }}
          descriptionStyle={{ paddingBottom: 4 }}
        />

        <Divider
          style={{
            marginVertical: 8,
            backgroundColor: theme.colors.outlineVariant,
          }}
        />

        <List.Item
          title="Animaciones"
          description="Habilitar animaciones en la interfaz"
          left={(props) => <List.Icon {...props} icon="animation" />}
          right={() => (
            <Switch
              value={true}
              onValueChange={() => showMessage("Próximamente disponible")}
              color={theme.colors.primary}
            />
          )}
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              borderRadius: 12,
            },
          ]}
          titleStyle={{ paddingVertical: 4 }}
          descriptionStyle={{ paddingBottom: 4 }}
        />
      </Card.Content>
    </Card>
  );

  const renderDataSection = () => (
    <Card
      style={[
        styles.dataCard,
        { backgroundColor: theme.colors.surfaceContainerHigh },
      ]}
    >
      <Card.Content>
        <Text
          variant="titleLarge"
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          <List.Icon icon="database" style={styles.sectionIcon} /> Datos{" "}
          {/* Ícono */}
        </Text>

        <List.Item
          title="Exportar datos"
          description="Descargar todos tus datos"
          left={(props) => <List.Icon {...props} icon="download" />}
          onPress={handleExportData}
          right={() => isExporting && <ActivityIndicator size="small" />}
          disabled={isExporting}
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              borderRadius: 12,
            },
          ]}
          titleStyle={{ paddingVertical: 4 }}
          descriptionStyle={{ paddingBottom: 4 }}
        />

        <Divider
          style={{
            marginVertical: 8,
            backgroundColor: theme.colors.outlineVariant,
          }}
        />

        <List.Item
          title="Limpiar datos"
          description="Eliminar todos los datos guardados"
          left={(props) => <List.Icon {...props} icon="delete" />}
          titleStyle={{ color: theme.colors.error, paddingVertical: 4 }}
          onPress={handleClearData}
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              borderRadius: 12,
            },
          ]}
          descriptionStyle={{ paddingBottom: 4 }}
        />
      </Card.Content>
    </Card>
  );

  const renderAboutSection = () => (
    <Card
      style={[
        styles.aboutCard,
        { backgroundColor: theme.colors.surfaceContainerHigh },
      ]}
    >
      <Card.Content>
        <Text
          variant="titleLarge"
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          <List.Icon icon="information" style={styles.sectionIcon} /> Acerca de{" "}
          {/* Ícono */}
        </Text>

        <List.Item
          title="Código fuente"
          description="Ver el proyecto en GitHub"
          left={(props) => <List.Icon {...props} icon="github" />}
          onPress={handleOpenGitHub}
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              borderRadius: 12,
            },
          ]}
          titleStyle={{ paddingVertical: 4 }}
          descriptionStyle={{ paddingBottom: 4 }}
        />

        <Divider
          style={{
            marginVertical: 8,
            backgroundColor: theme.colors.outlineVariant,
          }}
        />

        <List.Item
          title="Base de datos USDA"
          description="Fuente de datos nutricionales"
          left={(props) => <List.Icon {...props} icon="database" />}
          onPress={handleOpenUSDA}
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              borderRadius: 12,
            },
          ]}
          titleStyle={{ paddingVertical: 4 }}
          descriptionStyle={{ paddingBottom: 4 }}
        />

        <Divider
          style={{
            marginVertical: 8,
            backgroundColor: theme.colors.outlineVariant,
          }}
        />

        <List.Item
          title="Enviar feedback"
          description="Comparte tu opinión"
          left={(props) => <List.Icon {...props} icon="email" />}
          onPress={handleSendFeedback}
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              borderRadius: 12,
            },
          ]}
          titleStyle={{ paddingVertical: 4 }}
          descriptionStyle={{ paddingBottom: 4 }}
        />

        <Divider
          style={{
            marginVertical: 8,
            backgroundColor: theme.colors.outlineVariant,
          }}
        />

        <List.Item
          title="Versión"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              borderRadius: 12,
            },
          ]}
          titleStyle={{ paddingVertical: 4 }}
          descriptionStyle={{ paddingBottom: 4 }}
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
          style={{
            backgroundColor: theme.colors.surfaceContainerHigh,
            borderRadius: 28,
          }}
        >
          <Dialog.Title style={{ color: theme.colors.onSurface }}>
            Cambiar nombre
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nombre"
              value={tempName}
              onChangeText={setTempName}
              mode="outlined"
              autoFocus
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setShowNameDialog(false)}
              textColor={theme.colors.primary}
            >
              Cancelar
            </Button>
            <Button onPress={handleSaveName} textColor={theme.colors.primary}>
              Guardar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog para seleccionar tema */}
      <ThemeSelector
        showDialog={showThemeDialog}
        onDialogDismiss={() => setShowThemeDialog(false)}
      />

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        style={{
          backgroundColor: theme.colors.inverseSurface,
          borderRadius: 8,
        }}
        action={{
          label: "OK",
          onPress: () => setShowSnackbar(false),
          textColor: theme.colors.inversePrimary,
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
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  avatar: {
    marginBottom: 20,
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  userSubtitle: {
    marginBottom: 16,
  },
  themeChip: {
    marginBottom: 20,
  },
  editButton: {
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 28,
    paddingVertical: 8,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 28,
    paddingVertical: 8,
  },
  dataCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 28,
    paddingVertical: 8,
  },
  aboutCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 28,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 8,
    flexDirection: "row", // Para alinear el ícono y el texto en la misma línea
    alignItems: "center", // Centrar verticalmente
  },
  sectionIcon: {
    marginRight: 8, // Espacio entre el ícono y el texto
    width: 24, // Asegurar que el ícono tenga un ancho fijo
    height: 24, // Asegurar que el ícono tenga una altura fija
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 16,
  },
  statItem: {
    alignItems: "center",
    flexBasis: "48%",
    paddingVertical: 8,
  },
  settingItem: {
    marginVertical: 4,
    paddingVertical: 4,
  },
  themeControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quickToggleButton: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  bottomSpacing: {
    height: 48,
  },
});
