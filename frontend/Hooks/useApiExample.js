import { useState, useEffect } from 'react';
import { 
  useAuth, 
  useEducationalBooks, 
  useSupportDirectories,
  useMomsWeek,
  useDiary,
  useCalendar,
  useAdmin
} from './index';

/**
 * Hook de ejemplo que muestra cómo usar todos los servicios
 * Este hook puede ser usado como referencia para implementar en las pantallas
 */
export const useApiExample = () => {
  const [isReady, setIsReady] = useState(false);
  
  // Hooks de autenticación
  const { user, isAuthenticated, login, register, logout, isAdmin } = useAuth();
  
  // Hooks de funcionalidades
  const { books, loadBooks, searchBooks } = useEducationalBooks();
  const { directories, loadDirectories, searchDirectories } = useSupportDirectories();
  const { currentWeek, loadCurrentWeek, generateWeeklyBook } = useMomsWeek(user?.id);
  const { entries, createEntry, loadEntries } = useDiary(user?.id);
  const { events, createEvent, loadEvents } = useCalendar();
  const { stats, loadAllStats } = useAdmin();

  // Cargar datos cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      loadInitialData();
    }
  }, [isAuthenticated, user]);

  const loadInitialData = async () => {
    try {
      // Cargar datos en paralelo
      await Promise.all([
        loadBooks(),
        loadDirectories(),
        loadCurrentWeek(),
        loadEntries(),
        loadEvents(),
        isAdmin() ? loadAllStats() : Promise.resolve()
      ]);
      
      setIsReady(true);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    }
  };

  // Funciones de ejemplo para mostrar cómo usar los servicios
  const exampleLogin = async (identifier, password) => {
    try {
      const result = await login(identifier, password);
      console.log('Login exitoso:', result);
      return result;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const exampleSearchBooks = async (searchTerm) => {
    try {
      const result = await searchBooks(searchTerm);
      console.log('Búsqueda de libros:', result);
      return result;
    } catch (error) {
      console.error('Error en búsqueda de libros:', error);
      throw error;
    }
  };

  const exampleCreateDiaryEntry = async (entryData) => {
    try {
      const result = await createEntry(entryData);
      console.log('Entrada de diario creada:', result);
      return result;
    } catch (error) {
      console.error('Error al crear entrada de diario:', error);
      throw error;
    }
  };

  const exampleCreateEvent = async (eventData) => {
    try {
      const result = await createEvent(eventData);
      console.log('Evento creado:', result);
      return result;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  };

  return {
    // Estado
    isReady,
    user,
    isAuthenticated,
    isAdmin: isAdmin(),
    
    // Datos
    books,
    directories,
    currentWeek,
    entries,
    events,
    stats,
    
    // Funciones de autenticación
    login: exampleLogin,
    register,
    logout,
    
    // Funciones de funcionalidades
    searchBooks: exampleSearchBooks,
    createDiaryEntry: exampleCreateDiaryEntry,
    createEvent: exampleCreateEvent,
    
    // Funciones de carga
    loadBooks,
    loadDirectories,
    loadCurrentWeek,
    loadEntries,
    loadEvents,
    loadAllStats
  };
};
