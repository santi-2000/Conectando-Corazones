# Sistema de Conexión Backend-Frontend

Este directorio contiene todo el sistema de conexión entre el backend y frontend de la aplicación "Conectando Corazones".

## 📁 Estructura

```
proxy/
├── apiClient.js              # Cliente HTTP principal
├── services/                 # Servicios específicos por módulo
│   ├── authService.js        # Autenticación
│   ├── educationalBooksService.js  # Libros educativos
│   ├── supportDirectoriesService.js # Directorio de apoyos
│   ├── momsWeekService.js    # Moms Week
│   ├── diaryService.js       # Diario
│   ├── calendarService.js    # Calendario
│   ├── faforeService.js      # FAFORE
│   ├── childrenReadingsService.js # Lecturas infantiles
│   ├── adminService.js       # Administración
│   └── index.js              # Exportaciones
└── README.md                 # Esta documentación
```

## 🚀 Uso Básico

### 1. Importar servicios

```javascript
import { 
  authService, 
  educationalBooksService,
  supportDirectoriesService 
} from '../proxy/services';
```

### 2. Usar en componentes

```javascript
import React, { useState, useEffect } from 'react';
import { authService } from '../proxy/services';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (identifier, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.login(identifier, password);
      
      if (result.success) {
        // Usuario autenticado exitosamente
        console.log('Usuario:', result.user);
        // Navegar a la pantalla principal
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Tu componente JSX aquí
  );
};
```

## 🎣 Hooks Personalizados

### 1. Importar hooks

```javascript
import { 
  useAuth, 
  useEducationalBooks,
  useSupportDirectories 
} from '../Hooks';
```

### 2. Usar en componentes

```javascript
import React from 'react';
import { useAuth, useEducationalBooks } from '../Hooks';

const BooksScreen = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { books, loading, error, searchBooks } = useEducationalBooks();

  const handleSearch = async (searchTerm) => {
    try {
      await searchBooks(searchTerm);
    } catch (err) {
      console.error('Error en búsqueda:', err);
    }
  };

  if (!isAuthenticated) {
    return <Text>Por favor, inicia sesión</Text>;
  }

  return (
    // Tu componente JSX aquí
  );
};
```

## 🔧 Configuración

### Variables de entorno

El sistema usa la configuración en `constants/config.js`:

```javascript
export const CONFIG = {
  API_BASE_URL: 'http://localhost:3000/api/v1',
  // ... otras configuraciones
};
```

### Cambiar URL del backend

Para cambiar la URL del backend, modifica `constants/config.js`:

```javascript
export const CONFIG = {
  API_BASE_URL: 'https://tu-backend.com/api/v1',
  // ... otras configuraciones
};
```

## 📋 Servicios Disponibles

### AuthService
- `login(identifier, password)` - Iniciar sesión
- `register(userData)` - Registrar usuario
- `logout()` - Cerrar sesión
- `isAuthenticated()` - Verificar autenticación
- `getCurrentUser()` - Obtener usuario actual
- `isAdmin()` - Verificar si es administrador

### EducationalBooksService
- `getBooks(filters)` - Obtener libros
- `getBookById(bookId)` - Obtener libro por ID
- `searchBooks(searchTerm, filters)` - Buscar libros
- `getCategories()` - Obtener categorías
- `getBooksByCategory(category, filters)` - Libros por categoría
- `getBooksBySubject(subject, filters)` - Libros por materia

### SupportDirectoriesService
- `getDirectories(filters)` - Obtener directorios
- `getDirectoryById(directoryId)` - Obtener directorio por ID
- `searchDirectories(searchTerm, filters)` - Buscar directorios
- `getCategories()` - Obtener categorías
- `getDirectoriesByCategory(category, filters)` - Directorios por categoría

### MomsWeekService
- `getCurrentWeek(userId)` - Obtener semana actual
- `generateWeeklyBook(userId, bookData)` - Generar libro semanal
- `getWeekHistory(userId, filters)` - Obtener historial
- `getWeekStats(userId, filters)` - Obtener estadísticas
- `getWeekById(userId, weekId)` - Obtener semana por ID

### DiaryService
- `getEntries(userId, filters)` - Obtener entradas
- `createEntry(userId, entryData)` - Crear entrada
- `updateEntry(userId, entryId, entryData)` - Actualizar entrada
- `deleteEntry(userId, entryId)` - Eliminar entrada
- `getEntryById(userId, entryId)` - Obtener entrada por ID
- `getDiaryStats(userId, filters)` - Obtener estadísticas
- `generateDiaryPDF(userId, filters)` - Generar PDF

### CalendarService
- `getEvents(filters)` - Obtener eventos
- `createEvent(eventData)` - Crear evento
- `updateEvent(eventId, eventData)` - Actualizar evento
- `deleteEvent(eventId)` - Eliminar evento
- `getEventById(eventId)` - Obtener evento por ID
- `getEventsByDate(date)` - Eventos por fecha
- `getEventsByType(type, filters)` - Eventos por tipo

### FaforeService
- `getInfo()` - Obtener información de FAFORE
- `getServices()` - Obtener servicios de FAFORE

### ChildrenReadingsService
- `getReadings(filters)` - Obtener lecturas
- `getRecommendedReadings(filters)` - Obtener recomendadas
- `getReadingById(readingId)` - Obtener lectura por ID
- `getReadingsByAgeGroup(ageGroup, filters)` - Por grupo de edad
- `getCategories()` - Obtener categorías

### AdminService
- `getUserStats()` - Estadísticas de usuarios
- `getEventStats()` - Estadísticas de eventos
- `getPdfStats()` - Estadísticas de PDFs
- `getWeeklyStats()` - Estadísticas semanales
- `getMonthlyStats()` - Estadísticas mensuales
- `getAllStats()` - Todas las estadísticas

## 🎯 Hooks Disponibles

### useAuth
```javascript
const { 
  user, 
  isAuthenticated, 
  isLoading, 
  error, 
  login, 
  register, 
  logout, 
  isAdmin 
} = useAuth();
```

### useEducationalBooks
```javascript
const { 
  books, 
  loading, 
  error, 
  filters, 
  pagination, 
  loadBooks, 
  searchBooks, 
  getBookById, 
  getBooksByCategory, 
  getBooksBySubject, 
  getCategories, 
  updateFilters, 
  resetFilters 
} = useEducationalBooks(initialFilters);
```

### useSupportDirectories
```javascript
const { 
  directories, 
  loading, 
  error, 
  filters, 
  pagination, 
  loadDirectories, 
  searchDirectories, 
  getDirectoryById, 
  getDirectoriesByCategory, 
  getCategories, 
  updateFilters, 
  resetFilters 
} = useSupportDirectories(initialFilters);
```

### useMomsWeek
```javascript
const { 
  currentWeek, 
  weekHistory, 
  weekStats, 
  loading, 
  error, 
  loadCurrentWeek, 
  generateWeeklyBook, 
  loadWeekHistory, 
  loadWeekStats, 
  getWeekById 
} = useMomsWeek(userId);
```

### useDiary
```javascript
const { 
  entries, 
  stats, 
  loading, 
  error, 
  filters, 
  pagination, 
  loadEntries, 
  createEntry, 
  updateEntry, 
  deleteEntry, 
  getEntryById, 
  loadStats, 
  generatePDF, 
  updateFilters, 
  resetFilters 
} = useDiary(userId);
```

### useCalendar
```javascript
const { 
  events, 
  loading, 
  error, 
  filters, 
  pagination, 
  loadEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  getEventById, 
  getEventsByDate, 
  getEventsByType, 
  updateFilters, 
  resetFilters 
} = useCalendar(initialFilters);
```

### useAdmin
```javascript
const { 
  stats, 
  loading, 
  error, 
  loadAllStats, 
  loadUserStats, 
  loadEventStats, 
  loadPdfStats, 
  loadWeeklyStats, 
  loadMonthlyStats 
} = useAdmin();
```

## 🔒 Manejo de Errores

El sistema maneja automáticamente:

- **Errores de red**: "Error de conexión. Verifica tu conexión a internet."
- **Errores 401**: "Sesión expirada. Por favor, inicia sesión nuevamente."
- **Errores 403**: "No tienes permisos para realizar esta acción."
- **Errores 404**: "Recurso no encontrado."
- **Errores 500**: "Error interno del servidor."

## 🚀 Ejemplo Completo

```javascript
import React, { useState, useEffect } from 'react';
import { useAuth, useEducationalBooks } from '../Hooks';

const BooksScreen = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { 
    books, 
    loading, 
    error, 
    searchBooks, 
    getBooksByCategory 
  } = useEducationalBooks();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      // Cargar libros iniciales
      loadBooks();
    }
  }, [isAuthenticated]);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await searchBooks(searchTerm);
    }
  };

  const handleCategoryFilter = async (category) => {
    await getBooksByCategory(category);
  };

  if (!isAuthenticated) {
    return <Text>Por favor, inicia sesión</Text>;
  }

  return (
    <View>
      <Text>Bienvenido, {user.name}!</Text>
      
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar libros..."
      />
      <Button title="Buscar" onPress={handleSearch} />
      
      {loading && <Text>Cargando...</Text>}
      {error && <Text>Error: {error}</Text>}
      
      {books.map(book => (
        <View key={book.id}>
          <Text>{book.title}</Text>
          <Text>{book.author}</Text>
        </View>
      ))}
      
      <Button title="Cerrar Sesión" onPress={logout} />
    </View>
  );
};

export default BooksScreen;
```

## 📝 Notas Importantes

1. **Autenticación**: Siempre verifica `isAuthenticated` antes de hacer llamadas que requieren autenticación.

2. **Manejo de errores**: Siempre maneja los errores en los componentes para mostrar mensajes apropiados al usuario.

3. **Loading states**: Usa los estados de `loading` para mostrar indicadores de carga.

4. **Filtros**: Los hooks manejan automáticamente la recarga de datos cuando cambian los filtros.

5. **Paginación**: Los hooks incluyen información de paginación para implementar paginación en la UI.

6. **Debugging**: En modo desarrollo, las llamadas a la API se logean en la consola.

## 🔄 Actualizaciones

Para actualizar el sistema:

1. Modifica los servicios en `proxy/services/`
2. Actualiza los hooks en `Hooks/`
3. Actualiza la configuración en `constants/config.js`
4. Prueba los cambios en los componentes

¡El sistema está listo para usar! 🎉
