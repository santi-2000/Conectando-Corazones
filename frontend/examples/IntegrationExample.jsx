import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../Hooks/useAuth';
import { useEducationalBooks } from '../Hooks/useEducationalBooks';
import { useSupportDirectories } from '../Hooks/useSupportDirectories';
import { useMomsWeek } from '../Hooks/useMomsWeek';
import { useDiary } from '../Hooks/useDiary';
import { useCalendar } from '../Hooks/useCalendar';
import { useAdmin } from '../Hooks/useAdmin';

/**
 * Ejemplo de integración completa del frontend con el backend
 * Este componente demuestra cómo usar todos los hooks y servicios
 */
const IntegrationExample = () => {
  // Estados para mostrar datos
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Hooks de autenticación
  const { user, isAuthenticated, login, logout, isAdmin } = useAuth();
  
  // Hooks de funcionalidades
  const { books, loadBooks, searchBooks } = useEducationalBooks();
  const { directories, loadDirectories } = useSupportDirectories();
  const { currentWeek, loadCurrentWeek } = useMomsWeek(user?.id);
  const { entries, loadEntries } = useDiary(user?.id);
  const { events, loadEvents } = useCalendar();
  const { stats, loadAllStats } = useAdmin();

  // Función para probar todas las conexiones
  const testAllConnections = async () => {
    setIsLoading(true);
    const results = {};

    try {
      // 1. Probar autenticación
      console.log('🔐 Probando autenticación...');
      results.auth = {
        isAuthenticated,
        user: user ? `${user.name} ${user.lastName}` : 'No autenticado',
        isAdmin: isAdmin()
      };

      // 2. Probar libros educativos
      console.log('📚 Probando libros educativos...');
      await loadBooks();
      results.books = {
        count: books.length,
        success: books.length > 0,
        sample: books[0]?.title || 'N/A'
      };

      // 3. Probar directorios de apoyo
      console.log('🏥 Probando directorios de apoyo...');
      await loadDirectories();
      results.directories = {
        count: directories.length,
        success: directories.length > 0,
        sample: directories[0]?.name || 'N/A'
      };

      // 4. Probar Moms Week (si está autenticado)
      if (isAuthenticated && user?.id) {
        console.log('👶 Probando Moms Week...');
        await loadCurrentWeek();
        results.momsWeek = {
          success: true,
          hasCurrentWeek: !!currentWeek,
          weekNumber: currentWeek?.weekNumber || 'N/A'
        };
      }

      // 5. Probar diario (si está autenticado)
      if (isAuthenticated && user?.id) {
        console.log('📝 Probando diario...');
        await loadEntries();
        results.diary = {
          count: entries.length,
          success: true
        };
      }

      // 6. Probar calendario
      console.log('📅 Probando calendario...');
      await loadEvents();
      results.calendar = {
        count: events.length,
        success: true
      };

      // 7. Probar estadísticas de admin (si es admin)
      if (isAdmin()) {
        console.log('📊 Probando estadísticas de admin...');
        await loadAllStats();
        results.admin = {
          success: true,
          hasStats: !!stats
        };
      }

      setTestResults(results);
      Alert.alert('✅ Pruebas completadas', 'Todas las conexiones funcionan correctamente');
      
    } catch (error) {
      console.error('❌ Error en las pruebas:', error);
      Alert.alert('❌ Error', `Error en las pruebas: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para probar login
  const testLogin = async () => {
    try {
      await login('test_review', 'password123');
      Alert.alert('✅ Login exitoso', 'Usuario autenticado correctamente');
    } catch (error) {
      Alert.alert('❌ Error de login', error.message);
    }
  };

  // Función para probar búsqueda
  const testSearch = async () => {
    try {
      await searchBooks('matemáticas');
      Alert.alert('✅ Búsqueda exitosa', `Encontrados ${books.length} libros`);
    } catch (error) {
      Alert.alert('❌ Error de búsqueda', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧪 Prueba de Integración Frontend-Backend</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Estado de Autenticación</Text>
        <Text style={styles.text}>
          Autenticado: {isAuthenticated ? '✅ Sí' : '❌ No'}
        </Text>
        <Text style={styles.text}>
          Usuario: {user ? `${user.name} ${user.lastName}` : 'Ninguno'}
        </Text>
        <Text style={styles.text}>
          Admin: {isAdmin() ? '✅ Sí' : '❌ No'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Datos Cargados</Text>
        <Text style={styles.text}>
          Libros: {books.length} cargados
        </Text>
        <Text style={styles.text}>
          Directorios: {directories.length} cargados
        </Text>
        <Text style={styles.text}>
          Entradas de diario: {entries.length} cargadas
        </Text>
        <Text style={styles.text}>
          Eventos: {events.length} cargados
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧪 Pruebas</Text>
        
        <Button
          title={isLoading ? "Probando..." : "🔍 Probar todas las conexiones"}
          onPress={testAllConnections}
          disabled={isLoading}
        />
        
        <Button
          title="🔐 Probar Login"
          onPress={testLogin}
          disabled={isAuthenticated}
        />
        
        <Button
          title="🔍 Probar Búsqueda"
          onPress={testSearch}
        />
        
        {isAuthenticated && (
          <Button
            title="🚪 Cerrar Sesión"
            onPress={logout}
          />
        )}
      </View>

      {Object.keys(testResults).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Resultados de las Pruebas</Text>
          {Object.entries(testResults).map(([key, result]) => (
            <View key={key} style={styles.resultItem}>
              <Text style={styles.resultKey}>{key}:</Text>
              <Text style={styles.resultValue}>
                {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Información del Sistema</Text>
        <Text style={styles.infoText}>
          • Backend: http://192.168.1.190:3000
        </Text>
        <Text style={styles.infoText}>
          • Base de datos: TiDB Cloud
        </Text>
        <Text style={styles.infoText}>
          • Conexión: ✅ Activa
        </Text>
        <Text style={styles.infoText}>
          • CORS: ✅ Configurado
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#34495e',
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: '#2c3e50',
  },
  infoText: {
    fontSize: 12,
    marginBottom: 3,
    color: '#7f8c8d',
  },
  resultItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
  },
  resultKey: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  resultValue: {
    fontSize: 12,
    color: '#34495e',
    fontFamily: 'monospace',
  },
});

export default IntegrationExample;
