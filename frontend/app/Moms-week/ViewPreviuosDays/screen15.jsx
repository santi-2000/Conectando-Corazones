import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../constants/colors';
import { FontSizes, Spacing } from '../../../constants/dimensions';

export default function ViewPreviousDays() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    console.log('Navegando al perfil');
  };

  const handleDayPress = (dayNumber) => {
    console.log(`Navegando al día ${dayNumber}`);
    // Aquí iría la navegación al día específico
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Datos de los días (simulados)
  const days = [
    { number: 1, completed: true, date: 'Lunes 7 Oct', emotion: '😊', preview: 'Hoy jugué con mis amigos...' },
    { number: 2, completed: true, date: 'Martes 8 Oct', emotion: '🤩', preview: 'Mamá me ayudó con la tarea...' },
    { number: 3, completed: true, date: 'Miércoles 9 Oct', emotion: '😌', preview: 'Fui al parque y me divertí...' },
    { number: 4, completed: false, date: 'Jueves 10 Oct', emotion: null, preview: 'Día pendiente' },
    { number: 5, completed: false, date: 'Viernes 11 Oct', emotion: null, preview: 'Día pendiente' },
    { number: 6, completed: false, date: 'Sábado 12 Oct', emotion: null, preview: 'Día pendiente' },
    { number: 7, completed: false, date: 'Domingo 13 Oct', emotion: null, preview: 'Día pendiente' }
  ];

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
        </View>

        {/* Days List */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.daysContainer}>
            {days.map((day) => (
              <TouchableOpacity
                key={day.number}
                style={[
                  styles.dayCard,
                  day.completed ? styles.completedDay : styles.pendingDay
                ]}
                onPress={() => handleDayPress(day.number)}
              >
                <View style={styles.dayHeader}>
                  <Text style={styles.dayNumber}>Dia {day.number}</Text>
                  {day.completed && day.emotion && (
                    <Text style={styles.dayEmotion}>{day.emotion}</Text>
                  )}
                </View>
                
                <Text style={styles.dayDate}>{day.date}</Text>
                
                <Text style={[
                  styles.dayPreview,
                  !day.completed && styles.pendingText
                ]}>
                  {day.preview}
                </Text>

                {day.completed && (
                  <View style={styles.completedIndicator}>
                    <Text style={styles.completedText}>✅ Completado</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  daysContainer: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  dayCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
  },
  completedDay: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  pendingDay: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dayNumber: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  dayEmotion: {
    fontSize: 24,
  },
  dayDate: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  dayPreview: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  pendingText: {
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  completedIndicator: {
    alignSelf: 'flex-end',
  },
  completedText: {
    fontSize: FontSizes.sm,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
