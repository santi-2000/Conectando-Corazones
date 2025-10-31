import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  Modal
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/Button';
import { Colors } from '../../constants/colors';
import { FontSizes, Spacing } from '../../constants/dimensions';
import { useCalendar } from '../../Hooks/useCalendar';

export default function Calendario() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDebug, setShowDebug] = useState(true);

  // Hook para Calendario
  const { 
    events, 
    loading, 
    error, 
    fetchEvents 
  } = useCalendar('test_review');

  console.log('Calendario component loaded');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDebug(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Cargar eventos al montar el componente
  useEffect(() => {
    console.log('🔄 Cargando eventos del calendario...');
    fetchEvents();
  }, []);

  // Refrescar eventos cuando la pantalla se enfoca (después de crear un evento)
  // Usar useRef para evitar bucle infinito
  const fetchEventsRef = React.useRef(fetchEvents);
  fetchEventsRef.current = fetchEvents;
  
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 screen4: Pantalla enfocada, refrescando eventos...');
      // Usar un pequeño delay para evitar múltiples llamadas simultáneas
      const timeoutId = setTimeout(() => {
        fetchEventsRef.current();
      }, 100);
      return () => clearTimeout(timeoutId);
    }, []) // Array vacío para que solo se ejecute una vez al montar/enfocar
  ); 

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    router.push('/Usuario/screen17');
  };

  const handleAddDate = () => {
    console.log('Agregar fecha');
    router.push('/Calendario/Newdate/screen5');
  };

  const handleDatePress = (day) => {
    setSelectedDate(day);
    const dateKey = formatDateKey(day);
    
    // Buscar el evento completo en el array de events
    const fullEvent = events.find(e => {
      const eventDateKey = e.inicio ? e.inicio.split('T')[0] : 
                          (e.fecha_evento ? e.fecha_evento.split('T')[0] : 
                          (e.fecha_inicio ? e.fecha_inicio.split('T')[0] : ''));
      return eventDateKey === dateKey;
    });
    
    if (fullEvent) {
      setSelectedEvent(fullEvent);
      setShowEventModal(true);
      console.log('📅 Evento seleccionado:', fullEvent);
    } else {
      console.log('📅 Fecha seleccionada sin evento:', dateKey);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  // Convertir eventos del backend a formato del calendario
  const eventsMap = {};
  
  console.log('📅 screen4: Procesando eventos, cantidad:', events?.length || 0, 'tipo:', Array.isArray(events) ? 'array' : typeof events);
  
  if (events && Array.isArray(events) && events.length > 0) {
    events.forEach((e, index) => {
      console.log(`📅 screen4: Evento ${index}:`, JSON.stringify({ id: e.id, titulo: e.titulo, inicio: e.inicio, tipo: e.tipo }));
      
      // El backend devuelve eventos con campo 'inicio' (DATETIME)
      let dateKey = '';
      if (e.inicio) {
        dateKey = e.inicio.split('T')[0]; // Extraer YYYY-MM-DD de YYYY-MM-DD HH:mm:ss
      } else if (e.fecha_evento) {
        dateKey = e.fecha_evento.split('T')[0];
      } else if (e.fecha_inicio) {
        dateKey = e.fecha_inicio.split('T')[0];
      } else if (e.fecha) {
        dateKey = e.fecha.split('T')[0];
      }
      
      if (dateKey) {
        // Mapear el tipo de la BD (evento_familiar) al tipo del frontend (familiar)
        const tipoMap = {
          'evento_familiar': 'familiar',
          'evento_deportivo': 'deportivo',
          'recordatorio_personal': 'recordatorio',
          'evento_diferente': 'diferente',
          'cita_medica': 'medico',
          'reunion_escolar': 'educativo'
        };
        const tipoFrontend = tipoMap[e.tipo] || e.tipo || 'diferente';
        
        console.log(`✅ screen4: Evento mapeado para ${dateKey}:`, { tipo: tipoFrontend, titulo: e.titulo });
        eventsMap[dateKey] = {
          type: tipoFrontend,
          color: e.color || '#4A90E2',
          title: e.titulo || 'Evento',
          id: e.id
        };
      } else {
        console.warn(`⚠️ screen4: No se pudo extraer fecha del evento:`, e);
      }
    });
  } else if (events && typeof events === 'object' && events.eventos && Array.isArray(events.eventos)) {
    // Si events es un objeto con propiedad eventos
    events.eventos.forEach(event => {
      let dateKey = '';
      if (event.inicio) {
        dateKey = event.inicio.split('T')[0];
      } else if (event.fecha_evento) {
        dateKey = event.fecha_evento.split('T')[0];
      } else if (event.fecha_inicio) {
        dateKey = event.fecha_inicio.split('T')[0];
      }
      
      if (dateKey) {
        const tipoMap = {
          'evento_familiar': 'familiar',
          'evento_deportivo': 'deportivo',
          'recordatorio_personal': 'recordatorio',
          'evento_diferente': 'diferente',
          'cita_medica': 'medico',
          'reunion_escolar': 'educativo'
        };
        const tipoFrontend = tipoMap[event.tipo] || event.tipo || 'diferente';
        
        eventsMap[dateKey] = {
          type: tipoFrontend,
          color: event.color || '#4A90E2',
          title: event.titulo || 'Evento',
          id: event.id
        };
      }
    });
  }
  
  console.log('📅 screen4: eventsMap final:', Object.keys(eventsMap).length, 'fechas:', Object.keys(eventsMap));

  // Datos de eventos simulados como fallback
  const fallbackEvents = {
    '2024-06-04': { type: 'familiar', color: '#FFD700', title: 'Cumpleaños de mamá' },
    '2024-06-06': { type: 'familiar', color: '#FFD700', title: 'Día familiar' },
    '2024-06-10': { type: 'recordatorio', color: '#4A90E2', title: 'Cita médica' },
    '2024-06-11': { type: 'deportivo', color: '#90EE90', title: 'Partido de fútbol' },
    '2024-06-13': { type: 'diferente', color: '#FF69B4', title: 'Evento especial' },
    '2024-06-14': { type: 'deportivo', color: '#90EE90', title: 'Entrenamiento' },
    '2024-06-18': { type: 'deportivo', color: '#90EE90', title: 'Competencia' },
    '2024-06-19': { type: 'familiar', color: '#FFD700', title: 'Reunión familiar' },
    '2024-06-20': { type: 'recordatorio', color: '#4A90E2', title: 'Entrega de proyecto' },
    '2024-06-22': { type: 'diferente', color: '#9370DB', title: 'Visita al penitencial' },
    '2024-06-23': { type: 'diferente', color: '#FF69B4', title: 'Evento cultural' },
    '2024-06-26': { type: 'recordatorio', color: '#4A90E2', title: 'Reunión importante' }
  };

  // Usar eventos del backend o fallback
  const calendarEvents = Object.keys(eventsMap).length > 0 ? eventsMap : fallbackEvents;

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDateKey = (day) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getMonthName = (date) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[date.getMonth()];
  };

  const getYear = (date) => {
    return date.getFullYear();
  };

  const days = getDaysInMonth(currentMonth);

  // Mostrar loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={[Colors.gradient.start, Colors.gradient.end]}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando calendario...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={[Colors.gradient.start, Colors.gradient.end]}
          style={styles.gradient}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Debug message */}
      {showDebug && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>Calendario cargado correctamente</Text>
        </View>
      )}
      
      <LinearGradient
        colors={[Colors.gradient.start, Colors.gradient.end]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleProfile}>
            <Text style={styles.headerIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Calendario</Text>
            <View style={styles.calendarIcon}>
              {!imageError ? (
                <Image 
                  source={require('../../assets/images/home/calendario corazon.png')} 
                  style={styles.calendarImage}
                  resizeMode="contain"
                  onError={handleImageError}
                />
              ) : (
                <View style={styles.calendarFallback}>
                  <View style={styles.calendarGrid}>
                    <View style={styles.calendarRow}>
                      <View style={styles.calendarCell} />
                      <View style={styles.calendarCell} />
                      <View style={styles.calendarCell} />
                      <View style={styles.calendarCell} />
                    </View>
                    <View style={styles.calendarRow}>
                      <View style={styles.calendarCell} />
                      <View style={styles.calendarCell} />
                      <View style={styles.calendarCell} />
                      <View style={styles.calendarCell} />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Calendar Widget */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.calendarWidget}>
            {/* Month Navigation */}
            <View style={styles.monthHeader}>
              <TouchableOpacity style={styles.navButton} onPress={handlePreviousMonth}>
                <Text style={styles.navIcon}>‹</Text>
              </TouchableOpacity>
              
              <View style={styles.monthInfo}>
                <Text style={styles.monthText}>
                  {getMonthName(currentMonth)} {getYear(currentMonth)} ›
                </Text>
              </View>
              
              <TouchableOpacity style={styles.navButton} onPress={handleNextMonth}>
                <Text style={styles.navIcon}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Days of Week */}
            <View style={styles.daysOfWeek}>
              <Text style={styles.dayOfWeek}>SUN</Text>
              <Text style={styles.dayOfWeek}>MON</Text>
              <Text style={styles.dayOfWeek}>TUE</Text>
              <Text style={styles.dayOfWeek}>WED</Text>
              <Text style={styles.dayOfWeek}>THU</Text>
              <Text style={styles.dayOfWeek}>FRI</Text>
              <Text style={styles.dayOfWeek}>SAT</Text>
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {days.map((day, index) => {
                if (day === null) {
                  return <View key={index} style={styles.emptyDay} />;
                }

                const dateKey = formatDateKey(day);
                const event = calendarEvents[dateKey];
                const isSelected = selectedDate === day;
                const isToday = new Date().getDate() === day && 
                               new Date().getMonth() === currentMonth.getMonth() && 
                               new Date().getFullYear() === currentMonth.getFullYear();

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      isSelected && styles.selectedDay,
                      isToday && styles.todayDay
                    ]}
                    onPress={() => handleDatePress(day)}
                  >
                    <Text style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                      isToday && styles.todayDayText
                    ]}>
                      {day}
                    </Text>
                    {event && (
                      <View style={[styles.eventDot, { backgroundColor: event.color }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Add Date Button */}
          <Button
            title="Agregar fecha"
            onPress={handleAddDate}
            variant="primary"
            style={styles.addDateButton}
          />
        </ScrollView>
      </LinearGradient>

      {/* Modal de Detalles del Evento */}
      <Modal
        visible={showEventModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEventModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles del Evento</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedEvent && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Título */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Título</Text>
                  <Text style={styles.modalValue}>{selectedEvent.titulo || 'Sin título'}</Text>
                </View>

                {/* Descripción */}
                {selectedEvent.descripcion && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Descripción</Text>
                    <Text style={styles.modalValue}>{selectedEvent.descripcion}</Text>
                  </View>
                )}

                {/* Fecha y Hora */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Fecha</Text>
                  {selectedEvent.inicio && (
                    <Text style={styles.modalValue}>
                      {new Date(selectedEvent.inicio).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  )}
                  {selectedEvent.inicio && selectedEvent.inicio.includes('T') && !selectedEvent.inicio.includes('00:00:00') && (
                    <Text style={styles.modalTime}>
                      Hora: {new Date(selectedEvent.inicio).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  )}
                </View>

                {/* Tipo de Evento */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Tipo</Text>
                  <View style={styles.modalTypeContainer}>
                    <View style={[styles.modalTypeDot, { backgroundColor: selectedEvent.color || '#4A90E2' }]} />
                    <Text style={styles.modalValue}>
                      {selectedEvent.tipo === 'evento_familiar' || selectedEvent.tipo === 'familiar' ? 'Familiar' :
                       selectedEvent.tipo === 'evento_deportivo' || selectedEvent.tipo === 'deportivo' ? 'Deportivo' :
                       selectedEvent.tipo === 'recordatorio_personal' || selectedEvent.tipo === 'recordatorio' ? 'Recordatorio' :
                       selectedEvent.tipo === 'cita_medica' || selectedEvent.tipo === 'medico' ? 'Médico' :
                       selectedEvent.tipo === 'reunion_escolar' || selectedEvent.tipo === 'educativo' ? 'Educativo' :
                       'Diferente'}
                    </Text>
                  </View>
                </View>

                {/* Ubicación */}
                {selectedEvent.ubicacion && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Ubicación</Text>
                    <Text style={styles.modalValue}>📍 {selectedEvent.ubicacion}</Text>
                  </View>
                )}

                {/* Botones de Acción */}
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={() => {
                      setShowEventModal(false);
                      setSelectedEvent(null);
                    }}
                  >
                    <Text style={styles.modalButtonTextSecondary}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerIcon: {
    fontSize: 24,
    color: '#000',
  },
  titleSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  calendarIcon: {
    marginLeft: Spacing.md,
  },
  calendarImage: {
    width: 40,
    height: 40,
  },
  calendarFallback: {
    width: 40,
    height: 40,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  calendarRow: {
    flexDirection: 'row',
    gap: 2,
  },
  calendarCell: {
    width: 6,
    height: 6,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  calendarWidget: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  monthInfo: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  dayOfWeek: {
    fontSize: FontSizes.sm,
    color: '#999',
    fontWeight: '500',
    textAlign: 'center',
    width: 40,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyDay: {
    width: 40,
    height: 40,
    margin: 2,
  },
  dayCell: {
    width: 40,
    height: 40,
    margin: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: '#4A90E2',
  },
  todayDay: {
    backgroundColor: '#E6F4FE',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  dayText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todayDayText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  eventDot: {
    position: 'absolute',
    bottom: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  addDateButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: Spacing.xl,
  },
  debugContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
  },
  debugText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  loadingText: {
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  errorText: {
    fontSize: FontSizes.md,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: 'white',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  retryButtonText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  // Modal de Evento
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: Spacing.lg,
  },
  modalSection: {
    marginBottom: Spacing.lg,
  },
  modalLabel: {
    fontSize: FontSizes.sm,
    color: '#666',
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalValue: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  modalTime: {
    fontSize: FontSizes.sm,
    color: '#666',
    marginTop: Spacing.xs,
  },
  modalTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  modalTypeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: '#F0F0F0',
  },
  modalButtonTextSecondary: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: '600',
  },
});
