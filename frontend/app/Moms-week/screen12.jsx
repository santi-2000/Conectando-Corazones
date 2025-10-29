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
import Button from '../../components/Button';
import { Colors } from '../../constants/colors';
import { FontSizes, Spacing } from '../../constants/dimensions';
import { useMomsWeek } from '../../Hooks/useMomsWeek';
import { useDiary } from '../../Hooks/useDiary';

export default function MiSemanaConMama() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  
  // Hook para Moms Week
  const { 
    currentWeek, 
    weekStats, 
    loading, 
    error, 
    fetchCurrentWeek, 
    fetchWeekStats
  } = useMomsWeek('test_review');
  
  // Hook para Diario (para generar PDF)
  const { generatePDF } = useDiary('test_review');

  // Cargar datos al montar el componente
  // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
  // useEffect(() => {
  //   console.log('🔄 Cargando datos de Moms Week...');
  //   fetchCurrentWeek();
  // }, []);

  // Cargar estadísticas cuando cambie la semana actual
  // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
  // useEffect(() => {
  //   if (currentWeek?.id) {
  //     console.log('📊 Cargando estadísticas de la semana:', currentWeek.id);
  //     fetchWeekStats(currentWeek.id);
  //   }
  // }, [currentWeek]);

  // Recargar datos cuando el componente se enfoque (cuando regrese de agregar entrada)
  // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('🔄 Pantalla enfocada, recargando datos...');
  //     fetchCurrentWeek();
  //     if (currentWeek?.id) {
  //       fetchWeekStats(currentWeek.id);
  //     }
  //   }, []) // Remover dependencias para evitar bucle infinito
  // );

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    router.push('/Usuario/screen17');
  };

  const handleAgregarEntrada = () => {
    console.log('Agregar entrada de hoy');
    router.push('/Moms-week/TodaysActivity/screen13');
  };

  const handleGenerarPDF = async () => {
    try {
      console.log('🔄 Generando PDF...');
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

  // Usar datos del backend o valores por defecto
  const weeklyStats = weekStats || {
    daysCompleted: 0,
    totalDays: 7,
    emotions: {
      happy: 0,
      excited: 0,
      proud: 0,
      calm: 0,
      grateful: 0,
      sad: 0
    },
    photos: 0,
    words: 0
  };

  // Calcular semana actual
  const currentWeekNumber = getCurrentWeekNumber();
  const currentWeekRange = getCurrentWeekRange();

  const getMotivationalMessage = () => {
    const percentage = Math.round((weeklyStats.daysCompleted / weeklyStats.totalDays) * 100);
    if (percentage >= 100) return "🎉 ¡Semana completa! ¡Eres increíble!";
    if (percentage >= 70) return "🌟 ¡Vas súper bien! ¡Sigue así!";
    if (percentage >= 40) return "💪 ¡Buen progreso! ¡Continúa!";
    return "✨ ¡Empieza tu semana con mamá!";
  };

  // const handleVistaPreviaDias = () => {
  //   console.log('Ver días anteriores');
  //   router.push('/Moms-week/ViewPreviuosDays/screen15');
  // };

  const handleVistaPreviaPDF = () => {
    console.log('Ver preview PDF');
    router.push('/Moms-week/ViewPdf/screen14');
  };

  const handleImageError = () => {
    setImageError(true);
  };

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
            <Text style={styles.loadingText}>Cargando tu semana...</Text>
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
            <TouchableOpacity style={styles.retryButton} onPress={fetchCurrentWeek}>
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
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleProfile}>
            <Text style={styles.headerIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Mi semana con mama</Text>
            <Text style={styles.heartIcon}>💌</Text>
            <View style={styles.plannerIcon}>
              {!imageError ? (
                <Image 
                  source={require('../../assets/images/home/calendario corazon.png')} 
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
          <Text style={styles.subtitle}>Crea tu semana personal para mama</Text>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Main Card */}
          <View style={styles.mainCard}>
            <View style={styles.cardHeader}>
              <View style={styles.calendarIcon}>
                <Image 
                  source={require('../../assets/images/home/calendario corazon.png')} 
                  style={styles.calendarImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            
            <Text style={styles.cardText}>
              📅 Semana {currentWeekNumber} ({currentWeekRange})
            </Text>
            <Text style={styles.progressText}>
              {weeklyStats.daysCompleted} de {weeklyStats.totalDays} días completados
            </Text>
            
            {/* Motivational Message */}
            <View style={styles.motivationContainer}>
              <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
            </View>

            {/* Weekly Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{weeklyStats.photos}</Text>
                <Text style={styles.statLabel}>📸 Fotos</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{weeklyStats.words}</Text>
                <Text style={styles.statLabel}>📝 Palabras</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{weeklyStats.emotions.happy + weeklyStats.emotions.excited}</Text>
                <Text style={styles.statLabel}>😊 Feliz</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <Button
                title="✨ Agregar mi entrada de hoy"
                onPress={handleAgregarEntrada}
                variant="primary"
                style={styles.agregarButton}
              />

              <Button
                title="📄 Generar mi libro semanal"
                onPress={handleGenerarPDF}
                variant="secondary"
                style={styles.generarButton}
              />
            </View>
          </View>

          {/* Information Text */}
          <Text style={styles.infoText}>
            📚 Solo podrás generar tu libro semanal cuando completes todos los días
          </Text>

              {/* Bottom Navigation Cards */}
              <View style={styles.bottomCards}>
                {/* <TouchableOpacity 
                  style={styles.bottomCard}
                  onPress={handleVistaPreviaDias}
                >
                  <Text style={styles.bottomCardEmoji}>📖</Text>
                  <Text style={styles.bottomCardText}>
                    Ver mis días anteriores
                  </Text>
                  <Text style={styles.bottomCardSubtext}>
                    Revisa lo que escribiste
                  </Text>
                </TouchableOpacity> */}

                <TouchableOpacity 
                  style={[styles.bottomCard, styles.singleCard]}
                  onPress={handleVistaPreviaPDF}
                >
                  <Text style={styles.bottomCardEmoji}>👀</Text>
                  <Text style={styles.bottomCardText}>
                    Vista previa del libro
                  </Text>
                  <Text style={styles.bottomCardSubtext}>
                    Mira cómo se verá y edita
                  </Text>
                </TouchableOpacity>
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
    marginBottom: Spacing.sm,
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
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  mainCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  calendarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  calendarImage: {
    width: 24,
    height: 24,
  },
  cardText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  progressText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  motivationContainer: {
    backgroundColor: '#FFF0F5',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  motivationText: {
    fontSize: FontSizes.md,
    color: '#FF6B9D',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: '#4A90E2',
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
  buttonsContainer: {
    gap: Spacing.md,
  },
  agregarButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  generarButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    fontStyle: 'italic',
  },
  bottomCards: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  bottomCardEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  bottomCardText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
      bottomCardSubtext: {
        fontSize: FontSizes.sm,
        color: Colors.text.secondary,
        textAlign: 'center',
        fontStyle: 'italic',
      },
      singleCard: {
        width: '100%',
        maxWidth: 300,
        alignSelf: 'center',
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

