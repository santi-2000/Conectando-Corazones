import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { FontSizes, Spacing } from '../../../constants/dimensions';

export default function TodaysActivity() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [text, setText] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    console.log('Navegando al perfil');
  };

  const handleAddPhoto = () => {
    console.log('Agregar foto');
    // Aquí iría la lógica para seleccionar foto
  };

  const handleSaveDay = () => {
    console.log('Guardar día');
    // Aquí iría la lógica para guardar la entrada
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const emotions = [
    { id: 'happy', emoji: '😊', color: '#FFD700', name: 'Feliz', sparkle: '✨' },
    { id: 'sad', emoji: '😢', color: '#87CEEB', name: 'Triste', sparkle: '💙' },
    { id: 'proud', emoji: '😌', color: '#98FB98', name: 'Orgulloso', sparkle: '🌟' },
    { id: 'excited', emoji: '🤩', color: '#FFB6C1', name: 'Emocionado', sparkle: '🎉' },
    { id: 'calm', emoji: '😌', color: '#DDA0DD', name: 'Tranquilo', sparkle: '🦋' },
    { id: 'grateful', emoji: '🙏', color: '#F0E68C', name: 'Agradecido', sparkle: '💝' }
  ];

  // Progreso semanal (simulado)
  const weeklyProgress = [
    { day: 'Lun', completed: true, star: '⭐' },
    { day: 'Mar', completed: true, star: '⭐' },
    { day: 'Mié', completed: true, star: '⭐' },
    { day: 'Jue', completed: false, star: '☆' },
    { day: 'Vie', completed: false, star: '☆' },
    { day: 'Sáb', completed: false, star: '☆' },
    { day: 'Dom', completed: false, star: '☆' }
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
          <Text style={styles.dayText}>Dia 3</Text>
        </View>

        {/* Weekly Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Mi semana con mamá 🌟</Text>
          <View style={styles.weekProgress}>
            {weeklyProgress.map((day, index) => (
              <View key={index} style={styles.dayProgress}>
                <Text style={styles.dayText}>{day.day}</Text>
                <Text style={styles.starText}>{day.star}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.mainCard}>
            {/* Photo Section */}
            <TouchableOpacity style={styles.photoSection} onPress={handleAddPhoto}>
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraEmoji}>📷</Text>
              </View>
              <Text style={styles.photoText}>¡Toca aquí para agregar una foto!</Text>
              <Text style={styles.photoSubtext}>📸 Comparte un momento especial</Text>
            </TouchableOpacity>

            {/* Text Section */}
            <View style={styles.textSection}>
              <Text style={styles.textLabel}>💭 Hoy quiero contarle a mi mamá que...</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Cuéntame qué hiciste hoy, qué te hizo feliz, o algo especial que quieras compartir con mamá 💕"
                  placeholderTextColor="#999"
                  value={text}
                  onChangeText={setText}
                  multiline
                />
              </View>
            </View>

            {/* Emotion Section */}
            <View style={styles.emotionSection}>
              <Text style={styles.emotionLabel}>😊 ¿Cómo te sientes hoy?</Text>
              <Text style={styles.emotionInstruction}>
                Elige la emoción que mejor describa cómo te sientes
              </Text>
              
              <View style={styles.emotionsGrid}>
                {emotions.map((emotion) => (
                  <TouchableOpacity
                    key={emotion.id}
                    style={[
                      styles.emotionButton,
                      selectedEmotion === emotion.id && styles.selectedEmotion,
                      { backgroundColor: emotion.color }
                    ]}
                    onPress={() => setSelectedEmotion(emotion.id)}
                  >
                    <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
                    <Text style={styles.emotionName}>{emotion.name}</Text>
                    {selectedEmotion === emotion.id && (
                      <Text style={styles.sparkleEmoji}>{emotion.sparkle}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <Button
              title="💾 ¡Guardar mi día!"
              onPress={handleSaveDay}
              variant="primary"
              style={styles.saveButton}
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
  dayText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  weekProgress: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dayProgress: {
    alignItems: 'center',
    padding: Spacing.sm,
  },
  starText: {
    fontSize: 20,
    marginTop: Spacing.xs,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  mainCard: {
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
  photoSection: {
    height: 140,
    borderWidth: 3,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    backgroundColor: '#FFF0F5',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cameraIcon: {
    marginBottom: Spacing.sm,
  },
  cameraEmoji: {
    fontSize: 32,
  },
  photoText: {
    fontSize: FontSizes.md,
    color: '#FF6B9D',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  photoSubtext: {
    fontSize: FontSizes.sm,
    color: '#FF6B9D',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  textSection: {
    marginBottom: Spacing.xl,
  },
  textLabel: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    fontWeight: '500',
  },
  textInputContainer: {
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'dashed',
    borderRadius: 12,
    minHeight: 100,
    padding: Spacing.md,
    backgroundColor: '#F9F9F9',
  },
  textInput: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  emotionSection: {
    marginBottom: Spacing.xl,
  },
  emotionLabel: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  emotionInstruction: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  emotionButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  selectedEmotion: {
    borderColor: '#FFD700',
    borderWidth: 4,
    transform: [{ scale: 1.05 }],
  },
  emotionEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  emotionName: {
    fontSize: FontSizes.xs,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sparkleEmoji: {
    position: 'absolute',
    top: -5,
    right: -5,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
