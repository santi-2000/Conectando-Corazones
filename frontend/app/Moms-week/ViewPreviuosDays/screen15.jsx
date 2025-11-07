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
  Alert,
  Linking
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../constants/colors';
import { FontSizes, Spacing } from '../../../constants/dimensions';
import { useDiary } from '../../../Hooks/useDiary';
import Button from '../../../components/Button';
import { buildPdfUrl, getBackendBaseUrl } from '../../../utils/pdfUtils';
import { momsWeekService } from '../../../proxy/services/momsWeekService';
// Removido diaryService - screen15 solo edita, no genera PDFs

// Helper para construir URL de imagen
const buildImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (typeof imagePath === 'object' && imagePath.url) {
    imagePath = imagePath.url;
  }
  if (typeof imagePath !== 'string') return null;
  
  // Si ya es una URL completa
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si es una ruta relativa, construir URL completa
  const baseUrl = getBackendBaseUrl();
  if (imagePath.startsWith('/')) {
    return `${baseUrl}${imagePath}`;
  }
  return `${baseUrl}/${imagePath}`;
};

export default function ViewPreviousDays() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editingDateISO, setEditingDateISO] = useState(null);
  const [editPhotos, setEditPhotos] = useState([]);
  const [editEmotion, setEditEmotion] = useState(null);
  
  const emotions = [
    { id: 'happy', emoji: '😊', color: '#FFD700', name: 'Feliz', sparkle: '✨' },
    { id: 'sad', emoji: '😢', color: '#87CEEB', name: 'Triste', sparkle: '💙' },
    { id: 'proud', emoji: '😌', color: '#98FB98', name: 'Orgulloso', sparkle: '🌟' },
    { id: 'excited', emoji: '🤩', color: '#FFB6C1', name: 'Emocionado', sparkle: '🎉' },
    { id: 'calm', emoji: '😌', color: '#DDA0DD', name: 'Tranquilo', sparkle: '🦋' },
    { id: 'grateful', emoji: '🙏', color: '#F0E68C', name: 'Agradecido', sparkle: '💝' }
  ];

  // Datos reales del diario (solo funciones de edición, sin generatePDF)
  const {
    entries,
    loading,
    error,
    fetchEntries,
    updateEntry,
    createEntry
    // generatePDF removido - solo screen14 genera PDFs
  } = useDiary('test_review');

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    console.log('Navegando al perfil');
  };

  const handleDayPress = (entry, iso) => {
    if (!entry) {
      setEditingId(`new-${iso}`);
      setEditingDateISO(iso);
      setEditText('');
      setEditPhotos([]);
      setEditEmotion(null);
      return;
    }
    setEditingId(entry.id);
    setEditingDateISO(null);
    setEditText(entry.contenido || entry.titulo || '');
    setEditPhotos(Array.isArray(entry.fotos) ? entry.fotos : []);
    // Buscar la emoción actual del entry
    const currentEmotion = entry.emocion ? emotions.find(e => e.name === entry.emocion) : null;
    setEditEmotion(currentEmotion ? currentEmotion.id : null);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Refrescar datos al enfocar
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 screen15: useFocusEffect - Refrescando entradas...');
      fetchEntries();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );
  
  // Helpers de fecha local (evitar desfases por UTC)
  const toLocalYMD = (date) => {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const dd = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  const startOfWeekLocal = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentDay = start.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    start.setDate(start.getDate() + mondayOffset);
    return start;
  };

  // Mapear a días de la semana actual basados en entries - usar useMemo para recalcular cuando entries cambia
  const days = React.useMemo(() => {
    console.log('🔄 screen15: Recalculando days, entries:', entries.length);
    const start = startOfWeekLocal();
    const dayNames = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
    const map = {};
    
    // Mapear entries por fecha normalizada (YYYY-MM-DD)
    entries.forEach(e => {
      let dateStr;
      if (typeof e.fecha === 'string') {
        // Manejar tanto formato ISO completo como fecha simple
        dateStr = e.fecha.includes('T') ? e.fecha.split('T')[0] : e.fecha.slice(0,10);
      } else if (e.fecha instanceof Date) {
        dateStr = toLocalYMD(e.fecha);
      } else {
        dateStr = toLocalYMD(new Date(e.fecha));
      }
      
      // Normalizar a YYYY-MM-DD
      if (dateStr && dateStr.length >= 10) {
        dateStr = dateStr.substring(0, 10);
        map[dateStr] = e;
        console.log('🗺️ screen15: Mapeando entry:', {
          fechaOriginal: e.fecha,
          fechaNormalizada: dateStr,
          contenido: e.contenido?.substring(0, 20) || 'sin contenido'
        });
      }
    });
    
    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + idx);
      const iso = toLocalYMD(d);
      const e = map[iso];
      const isCompleted = !!e;
      console.log(`📆 screen15: Día ${idx + 1} (${dayNames[idx]} ${iso}):`, isCompleted ? `✅ Tiene entrada - "${e?.contenido?.substring(0, 20) || e?.titulo}"` : '⏳ Pendiente');
      return {
        number: idx + 1,
        dateLabel: `${dayNames[idx]} ${d.getDate()}/${d.getMonth() + 1}`,
        completed: isCompleted,
        emotion: e?.emocion || null,
        preview: e?.contenido || e?.titulo || 'Día pendiente',
        entry: e || null,
        iso,
      };
    });
  }, [entries]);

  const handleSaveEdit = async () => {
    try {
      // Validar que hay contenido
      if (!editText.trim()) {
        Alert.alert('Campo requerido', 'Por favor escribe algo sobre tu día.');
        return;
      }

      const isNew = typeof editingId === 'string' && editingId.startsWith('new-');
      const emotionData = editEmotion ? emotions.find(e => e.id === editEmotion) : null;
      
      console.log('💾 screen15: Guardando entrada...', { 
        isNew, 
        editingId, 
        editingDateISO,
        editText: editText.substring(0, 30), 
        emotion: emotionData?.name,
        fotosCount: editPhotos.length
      });
      
      let result;
      if (isNew && editingDateISO) {
        console.log('➕ screen15: Creando nueva entrada para fecha:', editingDateISO);
        try {
          const createResult = await createEntry({ 
            fecha: editingDateISO, 
            contenido: editText, 
            fotos: editPhotos,
            emocion: emotionData ? emotionData.name : null,
            emocion_emoji: emotionData ? emotionData.emoji : null,
            titulo: `Mi día ${editingDateISO}` // Agregar título por si acaso
          });
          
          // Verificar si es un error 409 (duplicado)
          // Si tiene httpStatus 409 o code DUPLICATE_ENTRY, es un error de duplicado
          if (createResult?.httpStatus === 409 || createResult?.code === 'DUPLICATE_ENTRY') {
            console.log('⚠️ screen15: Entrada duplicada detectada, actualizando en su lugar...');
            throw createResult; // Lanzar para que el catch lo maneje
          }
          
          // Si es un objeto con id, fecha, contenido, etc., es una entrada exitosa
          // NO verificar !createResult?.success porque el objeto de entrada no tiene ese campo
          if (createResult?.id && createResult?.fecha) {
            result = createResult;
            console.log('✅ screen15: Entrada creada exitosamente:', result);
          } else {
            // Si no tiene la estructura esperada, podría ser un error
            console.warn('⚠️ screen15: Respuesta inesperada de createEntry:', createResult);
            result = createResult;
          }
        } catch (createError) {
          // Si hay error 409 (duplicado), significa que ya existe - intentar actualizar en su lugar
          if (createError?.httpStatus === 409 || createError?.code === 'DUPLICATE_ENTRY') {
            console.log('⚠️ screen15: Ya existe entrada para fecha', editingDateISO);
            
            // Usar el data de la respuesta del error si está disponible
            const existingEntryData = createError?.data;
            
            if (existingEntryData && existingEntryData.id) {
              console.log('✅ screen15: Usando entrada del error para actualizar ID:', existingEntryData.id);
              result = await updateEntry(existingEntryData.id, { 
                contenido: editText, 
                fotos: editPhotos,
                emocion: emotionData ? emotionData.name : null,
                emocion_emoji: emotionData ? emotionData.emoji : null
              });
              console.log('✅ screen15: Entrada actualizada:', result);
              
              // Si la fecha está fuera del rango semanal actual, hacer un fetch con esa fecha específica
              // para asegurar que aparezca en entries
              const entryDate = existingEntryData.fecha ? 
                (typeof existingEntryData.fecha === 'string' ? existingEntryData.fecha.split('T')[0] : toLocalYMD(existingEntryData.fecha)) :
                editingDateISO;
              
              console.log('🔄 screen15: Refrescando entradas después de actualizar entrada ID:', existingEntryData.id);
              await fetchEntries();
              
              // También forzar un segundo fetch después de un momento para asegurar
              await new Promise(resolve => setTimeout(resolve, 200));
              await fetchEntries();
            } else {
              // Si no viene en el error, hacer fetch y buscar usando los datos frescos devueltos
              console.log('🔄 screen15: Buscando entrada en entries después de fetch...');
              
              // fetchEntries ahora devuelve las entradas frescas directamente
              const freshEntries = await fetchEntries();
              
              // Buscar la entrada existente con la fecha correcta en los datos frescos
              const existingEntry = freshEntries.find(e => {
                let entryDate;
                if (typeof e.fecha === 'string') {
                  entryDate = e.fecha.includes('T') ? e.fecha.split('T')[0] : e.fecha.slice(0, 10);
                } else {
                  entryDate = toLocalYMD(e.fecha);
                }
                const matches = entryDate === editingDateISO;
                if (matches) {
                  console.log('✅ screen15: Encontrada entrada existente:', e.id);
                }
                return matches;
              });
              
              if (existingEntry) {
                console.log('📝 screen15: Actualizando entrada existente ID:', existingEntry.id);
                result = await updateEntry(existingEntry.id, { 
                  contenido: editText, 
                  fotos: editPhotos,
                  emocion: emotionData ? emotionData.name : null,
                  emocion_emoji: emotionData ? emotionData.emoji : null
                });
                console.log('✅ screen15: Entrada actualizada:', result);
              } else {
                console.error('❌ screen15: No se encontró entrada para fecha:', editingDateISO);
                console.log('📋 screen15: Entradas disponibles:', freshEntries.map(e => ({
                  id: e.id,
                  fecha: typeof e.fecha === 'string' ? e.fecha.split('T')[0] : toLocalYMD(e.fecha),
                  contenido: e.contenido?.substring(0, 20)
                })));
                throw new Error('Ya existe una entrada para esta fecha. Por favor refresca la pantalla y edita la entrada existente.');
              }
            }
          } else {
            throw createError;
          }
        }
      } else {
        const entry = entries.find(e => e.id === editingId);
        if (!entry) {
          Alert.alert('Error', 'No se encontró la entrada a editar.');
          return;
        }
        console.log('📝 screen15: Actualizando entrada ID:', entry.id, 'fecha:', entry.fecha);
        result = await updateEntry(entry.id, { 
          contenido: editText, 
          fotos: editPhotos,
          emocion: emotionData ? emotionData.name : null,
          emocion_emoji: emotionData ? emotionData.emoji : null
        });
        console.log('✅ screen15: Entrada actualizada:', result);
      }
      
      // Limpiar el formulario de edición
      setEditingId(null);
      setEditText('');
      setEditingDateISO(null);
      setEditPhotos([]);
      setEditEmotion(null);
      
      // Refrescar múltiples veces para asegurar que se actualice
      // El primer refresh ya se hizo si fue una actualización de entrada existente (409)
      console.log('🔄 screen15: Primer refresh inmediato...');
      await fetchEntries();
      
      // Segundo refresh después de un momento
      setTimeout(async () => {
        console.log('🔄 screen15: Segundo refresh...');
        await fetchEntries();
        
        // Tercer refresh para asegurar completamente
        setTimeout(async () => {
          console.log('🔄 screen15: Tercer refresh final...');
          await fetchEntries();
          
          // Verificar que la entrada está en los datos
          console.log('📊 screen15: Entradas finales:', entries.length);
          entries.forEach(e => {
            let entryDate = typeof e.fecha === 'string' ? e.fecha.split('T')[0] : toLocalYMD(e.fecha);
            console.log('  - Entry:', {
              id: e.id,
              fecha: entryDate,
              contenido: e.contenido?.substring(0, 30),
              matchesEditingDate: entryDate === editingDateISO ? '✅ SÍ' : '❌ NO'
            });
          });
          
          // Verificar si la entrada guardada está en la lista
          const savedEntryFound = entries.some(e => {
            let entryDate = typeof e.fecha === 'string' ? e.fecha.split('T')[0] : toLocalYMD(e.fecha);
            return entryDate === editingDateISO;
          });
          
          if (!savedEntryFound && editingDateISO) {
            console.warn('⚠️ screen15: La entrada guardada no aparece en el rango semanal. Fecha:', editingDateISO);
            console.warn('⚠️ screen15: El backend puede estar usando un rango diferente. Rango esperado debería incluir:', editingDateISO);
          }
          
          Alert.alert(
            '✅ Guardado', 
            'Tu día ha sido guardado correctamente.\n\nVe a "Vista PDF" para generar el PDF actualizado.',
            [
              { 
                text: 'Ir a Vista PDF', 
                onPress: () => router.push('/Moms-week/ViewPdf/screen14') 
              },
              { text: 'OK', style: 'cancel' }
            ]
          );
        }, 400);
      }, 300);
    } catch (e) {
      // Si el error es en realidad una entrada exitosa (tiene id y fecha), no mostrar error
      if (e?.id && e?.fecha && e?.contenido) {
        console.log('✅ screen15: La "excepción" es en realidad una entrada exitosa, procesando como éxito');
        // Procesar como éxito - limpiar formulario y refrescar
        setEditingId(null);
        setEditText('');
        setEditingDateISO(null);
        setEditPhotos([]);
        setEditEmotion(null);
        
        await fetchEntries();
        setTimeout(async () => {
          await fetchEntries();
          Alert.alert(
            '✅ Guardado', 
            'Tu día ha sido guardado correctamente.\n\nVe a "Vista PDF" para generar el PDF actualizado.',
            [
              { 
                text: 'Ir a Vista PDF', 
                onPress: () => router.push('/Moms-week/ViewPdf/screen14') 
              },
              { text: 'OK', style: 'cancel' }
            ]
          );
        }, 500);
        return;
      }
      
      // Error real
      console.error('❌ screen15: Error al guardar:', e);
      const errorMessage = e?.message || (typeof e === 'string' ? e : 'No se pudo guardar. Verifica tu conexión.');
      Alert.alert('❌ Error', errorMessage);
    }
  };

  const handleAddPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Necesitamos acceso a tu galería para agregar fotos');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4,3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setEditPhotos(prev => [...prev, result.assets[0].uri]);
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  // Función para navegar a screen14 (sin generar PDF aquí)
  const handleIrAVistaPDF = () => {
    router.push('/Moms-week/ViewPdf/screen14');
  };

  const handleVerUltimoPDF = async () => {
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
  };

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
                onPress={() => handleDayPress(day.entry, day.iso)}
              >
                <View style={styles.dayHeader}>
                  <Text style={styles.dayNumber}>Dia {day.number}</Text>
                  {day.completed && day.emotion && (
                    <Text style={styles.dayEmotion}>{day.emotion}</Text>
                  )}
                </View>
                
                <Text style={styles.dayDate}>{day.dateLabel}</Text>
                
                {editingId === day.entry?.id || editingId === `new-${day.iso}` ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.editInput}
                      value={editText}
                      onChangeText={setEditText}
                      multiline
                      placeholder="Editar contenido del día"
                    />
                    
                    {/* Selector de emociones */}
                    <View style={styles.emotionEditContainer}>
                      <Text style={styles.emotionEditTitle}>😊 Emoción</Text>
                      <View style={styles.emotionsEditGrid}>
                        {emotions.map((emotion) => (
                          <TouchableOpacity
                            key={emotion.id}
                            style={[
                              styles.emotionEditButton,
                              editEmotion === emotion.id && styles.selectedEmotionEdit,
                              { backgroundColor: emotion.color }
                            ]}
                            onPress={() => setEditEmotion(emotion.id)}
                          >
                            <Text style={styles.emotionEditEmoji}>{emotion.emoji}</Text>
                            <Text style={styles.emotionEditName}>{emotion.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    
                    {/* Fotos del día (editar/agregar) */}
                    <View style={styles.photosEditContainer}>
                      <Text style={styles.photosTitle}>Fotos</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                        {editPhotos.map((p, idx) => {
                          const imageUri = typeof p === 'string' 
                            ? (p.startsWith('file://') || p.startsWith('http://') || p.startsWith('https://') ? p : buildImageUrl(p))
                            : buildImageUrl(p.url || p);
                          
                          if (!imageUri) return null;
                          
                          return (
                            <View key={idx} style={styles.photoItem}>
                              <Image 
                                source={{ uri: imageUri }} 
                                style={styles.photoThumb}
                                onError={(e) => {
                                  console.error('Error cargando imagen:', imageUri, e);
                                }}
                              />
                              <TouchableOpacity style={styles.removePhotoButton} onPress={() => setEditPhotos(prev => prev.filter((_, i) => i !== idx))}>
                                <Text style={styles.removePhotoText}>✕</Text>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                        <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto}>
                          <Text style={styles.addPhotoText}>➕</Text>
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
                    <View style={styles.editActions}>
                      <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                        <Text style={styles.saveBtnText}>Guardar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => { 
                        setEditingId(null); 
                        setEditText(''); 
                        setEditPhotos([]);
                        setEditEmotion(null);
                      }}>
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                <Text style={[
                  styles.dayPreview,
                  !day.completed && styles.pendingText
                ]}>
                  {day.preview}
                </Text>
                )}

                {day.completed && (
                  <View style={styles.completedIndicator}>
                    <Text style={styles.completedText}>✅ Completado</Text>
                  </View>
                )}

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleDayPress(day.entry, day.iso)}
                  >
                    <Text style={styles.actionBtnText}>{day.completed ? '✏️ Editar' : '➕ Agregar'}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={{ padding: Spacing.lg, gap: Spacing.md }}>
          <Button 
            title="📄 Ir a Vista PDF" 
            onPress={handleIrAVistaPDF} 
            variant="primary"
          />
          <Button 
            title="👀 Ver último PDF" 
            onPress={handleVerUltimoPDF} 
            variant="secondary" 
          />
        </View>
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
  editContainer: {
    marginTop: Spacing.sm,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFC107',
    padding: Spacing.md,
  },
  editInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#FFC107',
    borderRadius: 6,
    padding: Spacing.sm,
    color: Colors.text.primary,
  },
  photosEditContainer: {
    marginTop: Spacing.sm,
  },
  photosTitle: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  photosScroll: {
    flexGrow: 0,
  },
  photoItem: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  photoThumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFC107',
    backgroundColor: '#FFF',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addPhotoBtn: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFC107',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9E6',
  },
  addPhotoText: {
    fontSize: 22,
    color: '#FFC107',
    fontWeight: 'bold',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  cancelBtnText: {
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  actionRow: {
    marginTop: Spacing.sm,
    alignItems: 'flex-end',
  },
  actionBtn: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  actionBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
  },
  emotionEditContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emotionEditTitle: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  emotionsEditGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  emotionEditButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedEmotionEdit: {
    borderColor: '#FFD700',
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  emotionEditEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  emotionEditName: {
    fontSize: FontSizes.xs,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

