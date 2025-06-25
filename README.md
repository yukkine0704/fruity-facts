# 🍎 Fruity Facts

<div align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.79.4-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-~53.0.12-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-~5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Material%20Design%203-5.14.5-6200EE?style=for-the-badge&logo=material-design&logoColor=white" alt="Material Design" />
</div>

<div align="center">
  <h3>🌟 Descubre el mundo de las frutas y sus beneficios nutricionales 🌟</h3>
  <p>Una aplicación móvil moderna que te permite explorar información nutricional detallada de frutas usando la base de datos oficial del USDA.</p>
</div>

---

## ✨ Características Principales

### 🔍 **Exploración Inteligente**

- **Catálogo completo** de frutas con información nutricional
- **Búsqueda avanzada** con múltiples variaciones de términos
- **Estadísticas nutricionales** en tiempo real
- **Interfaz intuitiva** con Material Design 3

### 📊 **Información Detallada**

- **Macronutrientes**: Calorías, proteínas, carbohidratos, grasas
- **Micronutrientes**: Vitaminas y minerales esenciales
- **Datos oficiales** del USDA Food Database
- **Información de marcas** y productos comerciales

### 🎨 **Experiencia de Usuario**

- **Tema adaptativo** (claro/oscuro)
- **Animaciones fluidas** con Reanimated
- **Estados de carga informativos** con indicadores de progreso
- **Navegación intuitiva** con Expo Router
- **Diseño responsivo** para todos los dispositivos

### 🔄 **Funcionalidades Avanzadas**

- **Actualización por deslizamiento** (Pull to refresh)
- **Almacenamiento local** con AsyncStorage
- **Gestión de estado** con Zustand
- **Manejo robusto de errores**
- **Búsqueda progresiva** con múltiples intentos

---

## 🚀 Tecnologías Utilizadas

### **Frontend & UI**

- **React Native 0.79.4** - Framework principal
- **Expo ~53.0.12** - Plataforma de desarrollo
- **React Native Paper 5.14.5** - Componentes Material Design 3
- **Expo Material3 Theme** - Theming avanzado
- **React Native Reanimated 3.17.4** - Animaciones de alto rendimiento

### **Navegación & Routing**

- **Expo Router 5.1.0** - Navegación basada en archivos
- **React Navigation 7.x** - Stack y Tab navigation
- **React Native Screens** - Optimización de pantallas nativas

### **Estado & Datos**

- **Zustand 5.0.5** - Gestión de estado ligera
- **Axios 1.10.0** - Cliente HTTP para APIs
- **AsyncStorage** - Persistencia local de datos

### **Desarrollo & Calidad**

- **TypeScript 5.8.3** - Tipado estático
- **ESLint** - Linting y calidad de código
- **Expo Development Build** - Desarrollo nativo

---

## 📱 Capturas de Pantalla

<div align="center">
  <img src="screenshots/home.png" width="250" alt="Pantalla Principal" />
  <img src="screenshots/details.png" width="250" alt="Detalles Nutricionales" />
  <img src="screenshots/search.png" width="250" alt="Búsqueda Avanzada" />
</div>

---

## 🛠️ Instalación y Configuración

### **Prerrequisitos**

- Node.js 18+
- npm o yarn
- Expo CLI
- Dispositivo móvil o emulador

### **Instalación**

1. **Clona el repositorio**

```bash
git clone https://github.com/yukkine0704/fruity-facts.git
cd fruity-facts
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Configura las variables de entorno**

```bash
# Crea un archivo .env en la raíz del proyecto
EXPO_PUBLIC_USDA_API_KEY=tu_api_key_aqui
```

4. **Inicia el servidor de desarrollo**

```bash
npm start
```

5. **Ejecuta en tu dispositivo**

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

---

## 🔑 Configuración de API

Esta aplicación utiliza la **USDA Food Data Central API** para obtener información nutricional.

1. Visita [FoodData Central](https://fdc.nal.usda.gov/api-guide.html)
2. Regístrate para obtener una API key gratuita
3. Agrega tu API key al archivo `.env`

```env
EXPO_PUBLIC_USDA_API_KEY=tu_api_key_aqui
```

---

## 📁 Estructura del Proyecto

```
fruity-facts/
├── app/                          # Pantallas principales (Expo Router)
│   ├── (tabs)/                   # Navegación por pestañas
│   │   ├── explore.tsx           # Explorar frutas
│   │   └── _layout.tsx           # Layout de pestañas
│   ├── fruit-details/            # Detalles de frutas
│   │   └── [fruitName].tsx       # Pantalla dinámica de detalles
│   └── _layout.tsx               # Layout principal
├── components/                   # Componentes reutilizables
│   ├── ui/                       # Componentes base
│   ├── FruitCard.tsx            # Tarjeta de fruta
│   ├── NutritionDetailsCard.tsx # Detalles nutricionales
│   └── SearchProgressIndicator.tsx # Indicador de progreso
├── contexts/                     # Contextos de React
│   └── ThemeContext.tsx         # Gestión de temas
├── hooks/                        # Hooks personalizados
│   └── useFDCStore.ts           # Hook para API de USDA
├── stores/                       # Gestión de estado
│   ├── fruitStore.ts            # Store de frutas
│   └── fdcStore.ts              # Store de API USDA
├── types/                        # Definiciones de TypeScript
│   ├── fruit.ts                 # Tipos de frutas
│   └── fdc.ts                   # Tipos de API USDA
└── constants/                    # Constantes de la app
```

---

## 🎯 Funcionalidades Destacadas

### **Búsqueda Inteligente**

La aplicación implementa un sistema de búsqueda progresiva que:

- Prueba múltiples variaciones del nombre de la fruta
- Busca en diferentes categorías de alimentos
- Muestra el progreso de búsqueda en tiempo real
- Maneja errores de forma elegante

### **Información Nutricional Completa**

- **Macronutrientes** con iconos y colores distintivos
- **Vitaminas y minerales** organizados en grid
- **Información de marcas** para productos comerciales
- **Tamaños de porción** y datos de ingredientes

### **Experiencia de Usuario Premium**

- **Animaciones fluidas** en todas las transiciones
- **Estados de carga** informativos y atractivos
- **Temas adaptativos** que respetan las preferencias del sistema
- **Navegación intuitiva** con gestos nativos

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar Fruity Facts:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### **Ideas para Contribuir**

- 🌍 Internacionalización (i18n)
- 📊 Gráficos nutricionales interactivos
- 🔍 Filtros avanzados de búsqueda
- 📱 Widgets para pantalla de inicio
- 🍽️ Calculadora de porciones
- 💾 Favoritos y listas personalizadas

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Yukkine0704**

- GitHub: [@yukkine0704](https://github.com/yukkine0704)
- Email: [lubbok0704@gmail.com](mailto:lubbok0704@gmail.com)

---

## 🙏 Agradecimientos

- **USDA Food Data Central** por proporcionar la API de datos nutricionales
- **Expo Team** por la excelente plataforma de desarrollo
- **React Native Paper** por los hermosos componentes Material Design
- **Comunidad Open Source** por las increíbles librerías utilizadas

---

<div align="center">
  <h3>⭐ Si te gusta este proyecto, ¡dale una estrella! ⭐</h3>
  <p>Hecho con ❤️ y mucho 🍎</p>
</div>
