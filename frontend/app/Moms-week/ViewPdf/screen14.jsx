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
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { FontSizes, Spacing } from '../../../constants/dimensions';
import { useDiary } from '../../../Hooks/useDiary';
import { useMomsWeek } from '../../../Hooks/useMomsWeek';

export default function VistaPdf() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  
  // Hooks para Diario y Moms Week
  const { 
    entries, 
    stats, 
    loading: diaryLoading, 
    error: diaryError, 
    fetchEntries,
    generatePDF 
  } = useDiary('test_review');
  
  const { 
    currentWeek, 
    loading: weekLoading, 
    error: weekError, 
    fetchCurrentWeek 
  } = useMomsWeek('test_review');

  // Cargar datos al montar el componente
  // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
  // useEffect(() => {
  //   console.log('🔄 Cargando datos de Diario y Moms Week...');
  //   fetchCurrentWeek();
  //   fetchEntries();
  // }, []);

  // Recargar datos cuando el componente se enfoque (cuando regrese de agregar entrada)
  // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('🔄 Pantalla enfocada, recargando datos...');
  //     fetchCurrentWeek();
  //     fetchEntries();
  //   }, []) // Remover dependencias para evitar bucle infinito
  // );

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    console.log('Navegando al perfil');
  };

  const handleGenerarPDF = async () => {
    try {
      console.log('🔄 Generando PDF real...');
      const result = await generatePDF();
      console.log('✅ PDF generado:', result);
      
      if (result?.success && result?.data?.pdfUrl) {
        const pdfUrl = `http://192.168.0.22:3000${result.data.pdfUrl}`;
        console.log('📄 PDF URL:', pdfUrl);
        
        Alert.alert(
          'PDF Generado Exitosamente', 
          'Tu libro semanal ha sido generado. ¿Quieres verlo ahora?',
          [
            { text: 'Ver PDF', onPress: () => Linking.openURL(pdfUrl) },
            { text: 'Más tarde', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('Error', 'No se pudo obtener la URL del PDF generado.');
      }
    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF. Inténtalo de nuevo.');
    }
  };

  const handleEditarDia = (dayNumber) => {
    console.log(`Editar día ${dayNumber}`);
    // Aquí iría la navegación a la pantalla de edición del día específico
    router.push(`/Moms-week/TodaysActivity/screen13?day=${dayNumber}`);
  };


  const handleImageError = () => {
    setImageError(true);
  };

  // Función para calcular la semana actual del año
  const getCurrentWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  // Función para obtener el rango de fechas de la semana actual
  const getCurrentWeekRange = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDay + 1);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      return `${day} de ${getMonthName(date)}`;
    };
    
    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  };

  const getMonthName = (date) => {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return months[date.getMonth()];
  };

  // Calcular semana actual
  const currentWeekNumber = getCurrentWeekNumber();
  const currentWeekRange = getCurrentWeekRange();

  // Usar datos del backend o valores por defecto
  const weekData = {
    weekNumber: currentWeekNumber,
    dateRange: currentWeekRange,
    childName: 'Sofia',
    momName: 'Mamá',
    days: entries && entries.length > 0 ? entries.map(entry => ({
      day: entry.fecha ? new Date(entry.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }) : 'Día',
      emotion: entry.emocion || null,
      emotionName: entry.emocion || null,
      photo: entry.fotos && entry.fotos.length > 0 ? '📸' : null,
      text: entry.contenido || entry.titulo || 'Día completado',
      highlights: entry.tags || []
    })) : [
      {
        day: 'Lunes 7 Oct',
        emotion: null,
        emotionName: null,
        photo: null,
        text: 'Día pendiente',
        highlights: []
      },
      {
        day: 'Martes 8 Oct',
        emotion: null,
        emotionName: null,
        photo: null,
        text: 'Día pendiente',
        highlights: []
      },
      {
        day: 'Miércoles 9 Oct',
        emotion: null,
        emotionName: null,
        photo: null,
        text: 'Día pendiente',
        highlights: []
      },
      {
        day: 'Jueves 10 Oct',
        emotion: null,
        emotionName: null,
        photo: null,
        text: 'Día pendiente',
        highlights: []
      },
      {
        day: 'Viernes 11 Oct',
        emotion: null,
        emotionName: null,
        photo: null,
        text: 'Día pendiente',
        highlights: []
      },
      {
        day: 'Sábado 12 Oct',
        emotion: null,
        emotionName: null,
        photo: null,
        text: 'Día pendiente',
        highlights: []
      },
      {
        day: 'Domingo 13 Oct',
        emotion: null,
        emotionName: null,
        photo: null,
        text: 'Día pendiente',
        highlights: []
      }
    ]
  };

  const completedDays = weekData.days.filter(day => day.emotion !== null).length;
  const totalDays = weekData.days.length;

  // Mostrar loading
  if (diaryLoading || weekLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={[Colors.gradient.start, Colors.gradient.end]}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando tu diario...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Mostrar error
  if (diaryError || weekError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={[Colors.gradient.start, Colors.gradient.end]}
          style={styles.gradient}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {diaryError || weekError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => {
              // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
              // fetchCurrentWeek();
              // fetchEntries();
              console.log('Botón reintentar deshabilitado temporalmente');
            }}>
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
            <Text style={styles.title}>Mi semana con mama</Text>
            <Text style={styles.heartIcon}>💌</Text>
            <View style={styles.plannerIcon}>
              {!imageError ? (
                <Image 
                  source={require('../../../assets/images/home/calendario corazon.png')} 
                  style={styles.plannerImage}
                  resizeMode="contain"
                  onError={handleImageError}
                />
              ) : (
                <View style={styles.plannerBook}>
                  <View style={styles.plannerSpiral} />
                  <View style={styles.plannerPerson}>
                    <Text style={styles.personIcon}>👤</Text>
                  </View>
                  <View style={styles.plannerTabs}>
                    <View style={[styles.tab, { backgroundColor: '#4A90E2' }]} />
                    <View style={[styles.tab, { backgroundColor: '#7ED321' }]} />
                    <View style={[styles.tab, { backgroundColor: '#9013FE' }]} />
                  </View>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.subtitle}>Vista previa del libro semanal</Text>
        </View>

        {/* PDF Preview */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.pdfContainer}>
            {/* PDF Header */}
            <View style={styles.pdfHeader}>
              <Text style={styles.pdfTitle}>Mi Semana con Mamá</Text>
              <Text style={styles.pdfSubtitle}>Semana {weekData.weekNumber} ({weekData.dateRange})</Text>
              <Text style={styles.pdfChildName}>Por: {weekData.childName}</Text>
            </View>

            {/* Week Summary */}
            <View style={styles.weekSummary}>
              <Text style={styles.summaryTitle}>📊 Resumen de la Semana</Text>
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{completedDays}</Text>
                  <Text style={styles.statLabel}>Días completados</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{weekData.days.filter(d => d.photo).length}</Text>
                  <Text style={styles.statLabel}>Fotos</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{weekData.days.reduce((acc, day) => acc + (day.text?.length || 0), 0)}</Text>
                  <Text style={styles.statLabel}>Palabras</Text>
                </View>
              </View>
            </View>

            {/* Days */}
            {weekData.days.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>{day.day}</Text>
                  {day.emotion && (
                    <View style={styles.emotionContainer}>
                      <Text style={styles.dayEmotion}>{day.emotion}</Text>
                      <Text style={styles.emotionName}>{day.emotionName}</Text>
                    </View>
                  )}
                </View>

                {day.emotion ? (
                  <View style={styles.dayContent}>
                    {/* Photo Section */}
                    <View style={styles.photoSection}>
                      <Text style={styles.photoIcon}>{day.photo}</Text>
                      <Text style={styles.photoText}>Momento especial del día</Text>
                    </View>

                    {/* Text Content */}
                    <View style={styles.textSection}>
                      <Text style={styles.textLabel}>💭 Lo que quiero contarle a mi mamá:</Text>
                      <Text style={styles.dayText}>{day.text}</Text>
                    </View>

                    {/* Highlights */}
                    {day.highlights.length > 0 && (
                      <View style={styles.highlightsSection}>
                        <Text style={styles.highlightsTitle}>✨ Momentos especiales:</Text>
                        {day.highlights.map((highlight, idx) => (
                          <Text key={idx} style={styles.highlightItem}>• {highlight}</Text>
                        ))}
                      </View>
                    )}

                    {/* Edit Button */}
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEditarDia(day.day.split(' ')[1])}
                    >
                      <Text style={styles.editButtonText}>✏️ Editar este día</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.pendingDay}>
                    <Text style={styles.pendingText}>📝 Día pendiente</Text>
                    <Text style={styles.pendingSubtext}>Completa este día para incluirlo en tu libro</Text>
                    
                    {/* Add Day Button */}
                    <TouchableOpacity 
                      style={styles.addDayButton}
                      onPress={() => handleEditarDia(day.day.split(' ')[1])}
                    >
                      <Text style={styles.addDayButtonText}>➕ Agregar entrada</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}

            {/* Footer */}
            <View style={styles.pdfFooter}>
              <Text style={styles.footerText}>💕 Creado con amor para {weekData.momName}</Text>
              <Text style={styles.footerDate}>Generado el {new Date().toLocaleDateString('es-ES')}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="📄 Generar PDF Real"
              onPress={handleGenerarPDF}
              variant="primary"
              style={styles.generateButton}
            />
          </View>
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
  heartIcon: {
    fontSize: 24,
  },
  plannerIcon: {
    marginLeft: Spacing.md,
  },
  plannerImage: {
    width: 40,
    height: 40,
  },
  plannerBook: {
    width: 40,
    height: 50,
    backgroundColor: '#FF9500',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  plannerSpiral: {
    position: 'absolute',
    left: -4,
    top: 5,
    width: 3,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  plannerPerson: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  personIcon: {
    fontSize: 16,
  },
  plannerTabs: {
    position: 'absolute',
    right: -6,
    top: 8,
    flexDirection: 'column',
    gap: 2,
  },
  tab: {
    width: 4,
    height: 6,
    borderRadius: 1,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: '500',
    marginTop: Spacing.sm,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  pdfContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pdfHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  pdfTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  pdfSubtitle: {
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  pdfChildName: {
    fontSize: FontSizes.md,
    color: '#4A90E2',
    fontWeight: '500',
  },
  weekSummary: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  summaryTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: '#4A90E2',
    fontWeight: '500',
    marginTop: Spacing.xs,
  },
  dayContainer: {
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dayTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  emotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayEmotion: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  emotionName: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  dayContent: {
    padding: Spacing.lg,
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
  },
  photoIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  photoText: {
    fontSize: FontSizes.md,
    color: '#FF6B9D',
    fontWeight: '500',
  },
  textSection: {
    marginBottom: Spacing.md,
  },
  textLabel: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  dayText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  highlightsSection: {
    backgroundColor: '#F0F8FF',
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  highlightsTitle: {
    fontSize: FontSizes.md,
    color: '#4A90E2',
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  highlightItem: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  pendingDay: {
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  pendingText: {
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  pendingSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  pdfFooter: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: FontSizes.md,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  footerDate: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  actionButtons: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  generateButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  editButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    padding: Spacing.md,
    marginTop: Spacing.md,
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: 'white',
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  addDayButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: Spacing.md,
    marginTop: Spacing.md,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addDayButtonText: {
    color: 'white',
    fontSize: FontSizes.md,
    fontWeight: 'bold',
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
