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
  TextInput,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { FontSizes, Spacing } from '../../../constants/dimensions';
import { useDiary } from '../../../Hooks/useDiary';
import { momsWeekService } from '../../../proxy/services/momsWeekService';
import { buildPdfUrl } from '../../../utils/pdfUtils';

export default function TodaysActivity() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hook para el diario
  const {
    entries,
    stats,
    loading: diaryLoading,
    error: diaryError,
    fetchEntries,
    createEntry
  } = useDiary('test_review');

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    console.log('Navegando al perfil');
  };

  // Cargar entradas al enfocar la pantalla
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 screen13: Cargando entradas del diario...');
      fetchEntries();
    }, [])
  );

  const handleAddPhoto = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos necesarios', 'Necesitamos acceso a tu galería para agregar fotos');
        return;
      }

      // Mostrar opciones
      Alert.alert(
        'Seleccionar foto',
        '¿De dónde quieres tomar la foto?',
        [
          {
            text: 'Galería',
            onPress: () => pickImageFromGallery()
          },
          {
            text: 'Cámara',
            onPress: () => takePhotoWithCamera()
          },
          {
            text: 'Cancelar',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      Alert.alert('Error', 'No se pudieron solicitar los permisos');
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = result.assets[0].uri;
        setPhotos(prev => [...prev, newPhoto]);
        Alert.alert('¡Foto agregada!', 'Se ha agregado una foto de tu galería');
      }
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos necesarios', 'Necesitamos acceso a tu cámara para tomar fotos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = result.assets[0].uri;
        setPhotos(prev => [...prev, newPhoto]);
        Alert.alert('¡Foto tomada!', 'Se ha agregado una foto de tu cámara');
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handleSaveDay = async () => {
    if (!selectedEmotion || !text.trim()) {
      Alert.alert('Campos requeridos', 'Por favor selecciona una emoción y escribe algo sobre tu día');
      return;
    }

    // Usar fecha local (no UTC) para evitar desfases
    const todayLocal = new Date();
    const today = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, '0')}-${String(todayLocal.getDate()).padStart(2, '0')}`;
    
    // Verificar si ya existe una entrada para hoy
    const existingEntry = entries.find(entry => {
      const entryDate = entry.fecha ? entry.fecha.split('T')[0] : null;
      return entryDate === today;
    });

    if (existingEntry) {
      Alert.alert(
        'Día ya completado', 
        'Ya tienes una entrada para hoy. ¿Quieres editarla?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Editar', onPress: () => {
            router.replace('/Moms-week/ViewPreviuosDays/screen15');
          }}
        ]
      );
      return;
    }

    setLoading(true);
    try {
      const emotionData = emotions.find(e => e.id === selectedEmotion);
      
      const entryData = {
        fecha: today,
        titulo: `Mi día ${new Date().toLocaleDateString('es-ES')}`,
        contenido: text,
        fotos: photos,
        emocion: emotionData.name,
        emocion_emoji: emotionData.emoji,
        tags: [`${emotionData.name}`, 'día especial']
      };

      console.log('💾 Guardando entrada:', entryData);
      const result = await createEntry(entryData);

      // Manejar duplicado explícitamente (409)
      if (result?.code === 'DUPLICATE_ENTRY') {
        Alert.alert(
          'Día ya registrado',
          'Ya existe una entrada para hoy. ¿Quieres editarla?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Editar', onPress: () => router.push('/Moms-week/ViewPreviuosDays/screen15') }
          ]
        );
        return;
      }

      Alert.alert(
        '¡Día guardado!', 
        'Tu entrada se ha guardado exitosamente. ¡Mamá estará muy feliz de leerla!',
        [
          {
            text: 'OK',
            onPress: () => {
              setText('');
              setSelectedEmotion(null);
              setPhotos([]);
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar tu entrada. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
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

  // Calcular progreso semanal basado en las entradas reales
  const getWeeklyProgress = () => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    // Ajustar para que la semana empiece en lunes
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    return days.map((dayName, index) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + index);
      const dateString = dayDate.toISOString().split('T')[0];
      
      // Verificar si hay una entrada para este día
      const hasEntry = entries && entries.some(entry => entry.fecha === dateString);
      
      return {
        day: dayName,
        completed: hasEntry,
        star: hasEntry ? '⭐' : '☆',
        date: dateString
      };
    });
  };

  const weeklyProgress = getWeeklyProgress();

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
            <View style={styles.photoSection}>
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <View style={styles.cameraIcon}>
                  <Text style={styles.cameraEmoji}>📷</Text>
                </View>
                <Text style={styles.photoText}>¡Toca aquí para agregar una foto!</Text>
                <Text style={styles.photoSubtext}>📸 Comparte un momento especial</Text>
              </TouchableOpacity>
              
              {/* Mostrar fotos seleccionadas */}
              {photos.length > 0 && (
                <View style={styles.selectedPhotosContainer}>
                  <Text style={styles.selectedPhotosTitle}>Fotos seleccionadas ({photos.length}):</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                    {photos.map((photo, index) => (
                      <View key={index} style={styles.photoItem}>
                        <Image source={{ uri: photo }} style={styles.selectedPhoto} />
                        <TouchableOpacity 
                          style={styles.removePhotoButton}
                          onPress={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                        >
                          <Text style={styles.removePhotoText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

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
              title={loading ? "💾 Guardando..." : "💾 ¡Guardar mi día!"}
              onPress={handleSaveDay}
              variant="primary"
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              disabled={loading}
            />

          {/* Navigation Buttons */}
          <View style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
            <Button
              title="👀 Vista previa (editar días)"
              onPress={() => router.replace('/Moms-week/ViewPreviuosDays/screen15')}
              variant="secondary"
            />
            <Button
              title="📄 Ver mi último PDF"
              onPress={async () => {
                try {
                  const resp = await momsWeekService.getLatestPdf('test_review');
                  const data = resp?.data || resp;
                  const url = buildPdfUrl(data?.data?.pdfUrl || data?.pdfUrl);
                  if (url) {
                    router.push(`/Moms-week/ViewPdf/screen14?pdf=${encodeURIComponent(url)}`);
                  } else {
                    Alert.alert('Sin PDF', 'Aún no hay PDFs generados.');
                  }
                } catch (e) {
                  Alert.alert('Sin PDF', 'Aún no hay PDFs generados.');
                }
              }}
              variant="secondary"
            />
          </View>
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
    marginBottom: Spacing.xl,
  },
  addPhotoButton: {
    height: 140,
    borderWidth: 3,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedPhotosContainer: {
    marginTop: Spacing.md,
  },
  selectedPhotosTitle: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  photosScroll: {
    maxHeight: 100,
  },
  photoItem: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  selectedPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  saveButtonDisabled: {
    backgroundColor: '#CCC',
    shadowOpacity: 0.1,
  },
});
