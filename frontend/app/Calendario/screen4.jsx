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
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
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

  const handleDatePress = (date) => {
    setSelectedDate(date);
    console.log('Fecha seleccionada:', date);
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
  if (events && events.length > 0) {
    events.forEach(event => {
      const dateKey = event.fecha_inicio ? event.fecha_inicio.split('T')[0] : '';
      if (dateKey) {
        eventsMap[dateKey] = {
          type: event.tipo_evento || 'diferente',
          color: event.color || '#4A90E2',
          title: event.titulo || 'Evento',
          id: event.id
        };
      }
    });
  }

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

          {/* Event Legend */}
          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Leyenda de Eventos</Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF69B4' }]} />
                <Text style={styles.legendText}>Evento Dif</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF4500' }]} />
                <Text style={styles.legendText}>Visita al penitencial</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#90EE90' }]} />
                <Text style={styles.legendText}>Evento Deportivo</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFD700' }]} />
                <Text style={styles.legendText}>Evento Familiar</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4A90E2' }]} />
                <Text style={styles.legendText}>Recordatorio</Text>
              </View>
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
  legendContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  legendItems: {
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  legendText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
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
});
