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
import * as WebBrowser from 'expo-web-browser';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { FontSizes, Spacing } from '../../../constants/dimensions';
import { useDiary } from '../../../Hooks/useDiary';
import { useMomsWeek } from '../../../Hooks/useMomsWeek';
import { buildPdfUrl, getBackendBaseUrl } from '../../../utils/pdfUtils';
import { momsWeekService } from '../../../proxy/services/momsWeekService';
import { diaryService } from '../../../proxy/services/diaryService';

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

export default function VistaPdf() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [imageError, setImageError] = useState(false);
  const [externalPdfUrl, setExternalPdfUrl] = useState(null);
  
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

  // Función para obtener último PDF (definida antes de useEffect)
  const handleVerUltimoPDF = async () => {
    try {
      const resp = await momsWeekService.getLatestPdf('test_review');
      const data = resp.data || resp;
      const url = buildPdfUrl(data?.data?.pdfUrl || data?.pdfUrl);
      if (url) {
        console.log('📄 Último PDF encontrado:', url);
        // Forzar actualización con timestamp
        setExternalPdfUrl(`${url.split('?')[0]}?t=${Date.now()}`);
      } else {
        console.log('⚠️ No hay PDF disponible');
        setExternalPdfUrl(null);
      }
    } catch (e) {
      console.log('⚠️ Error obteniendo último PDF:', e.message);
      setExternalPdfUrl(null);
    }
  };

  // Tomar PDF pasado por query si existe y evitar abrir navegador externo
  useEffect(() => {
    if (params?.pdf) {
      const decodedUrl = decodeURIComponent(params.pdf);
      console.log('📄 PDF desde params:', decodedUrl);
      setExternalPdfUrl(decodedUrl);
    } else {
      // Si no hay params, intentar obtener el último PDF al cargar
      handleVerUltimoPDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.pdf]);

  // Refrescar datos al enfocar la pantalla (evita loops y asegura preview actualizada)
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 screen14: Refrescando datos al enfocar...');
      fetchCurrentWeek();
      fetchEntries();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  // No se usa otro efecto para evitar dobles disparos

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    console.log('Navegando al perfil');
  };

  const handleGenerarPDF = async () => {
    try {
      console.log('🔄 Generando PDF real con datos de screen14...');
      
      // Preparar datos exactos que se muestran en screen14
      const pdfData = {
        weekNumber: weekData.weekNumber,
        dateRange: weekData.dateRange,
        childName: weekData.childName,
        momName: weekData.momName,
        days: weekDays.map(day => ({
          dayNumber: weekDays.indexOf(day) + 1, // 1-7
          dayName: day.day,
          fecha: day.fecha,
          emotion: day.emotion,
          emotionName: day.emotionName,
          photos: day.entry && day.entry.fotos 
            ? (Array.isArray(day.entry.fotos) 
                ? day.entry.fotos.filter(f => f !== null && f !== undefined) // Filtrar nulos
                : day.entry.fotos ? [day.entry.fotos] : [])
            : [],
          text: day.text,
          tags: day.highlights,
          entry: day.entry ? {
            id: day.entry.id,
            titulo: day.entry.titulo,
            contenido: day.entry.contenido,
            fotos: day.entry.fotos,
            emocion: day.entry.emocion,
            tags: day.entry.tags,
            fecha: day.entry.fecha
          } : null
        }))
      };
      
      console.log('📊 Datos enviados al PDF:', pdfData);
      
      // Enviar datos exactos al backend usando diaryService directamente
      const result = await diaryService.generatePDF('test_review', pdfData);
      console.log('✅ PDF generado:', result);
      
      if (result?.success && result?.data?.pdfUrl) {
        const pdfUrl = buildPdfUrl(result.data.pdfUrl);
        console.log('🔗 URL del PDF construida:', pdfUrl);
        // Forzar actualización del estado con un timestamp para evitar cache
        setExternalPdfUrl(`${pdfUrl}?t=${Date.now()}`);
        // Refrescar datos después de generar para ver el PDF actualizado
        await fetchEntries();
        Alert.alert('PDF generado', `PDF actualizado: ${pdfUrl.split('/').pop()}\n\nPresiona "Abrir PDF en navegador" para verlo.`);
      } else {
        Alert.alert('Error', 'No se pudo obtener la URL del PDF generado.');
      }
    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF. Inténtalo de nuevo.');
    }
  };

  // Vista solo lectura (sin edición desde esta pantalla)


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

  // Helpers de fecha local
  const toLocalDate = (iso) => {
    if (!iso) return new Date();
    const [y,m,d] = iso.split('T')[0].split('-').map(n => parseInt(n, 10));
    return new Date(y, m - 1, d);
  };

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

  // Construir 7 días de la semana (lunes a domingo) con entradas correspondientes
  // Usar useMemo para recalcular cuando entries cambia
  const buildWeekDays = React.useMemo(() => {
    console.log('🔄 screen14: Recalculando weekDays, entries:', entries.length);
    const start = startOfWeekLocal();
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    
    // Mapear entries por fecha (YYYY-MM-DD) - normalizar formatos
    const entryMap = {};
    if (entries && entries.length > 0) {
      entries.forEach(e => {
        let dateStr;
        if (typeof e.fecha === 'string') {
          // Manejar tanto formato ISO completo como fecha simple
          dateStr = e.fecha.includes('T') ? e.fecha.split('T')[0] : e.fecha.slice(0, 10);
        } else if (e.fecha instanceof Date) {
          dateStr = toLocalYMD(e.fecha);
        } else {
          dateStr = toLocalYMD(new Date(e.fecha));
        }
        
        // Asegurar formato YYYY-MM-DD
        if (dateStr && dateStr.length >= 10) {
          dateStr = dateStr.substring(0, 10);
          entryMap[dateStr] = e;
        }
      });
      console.log('🗺️ screen14: EntryMap:', Object.keys(entryMap).map(k => ({
        fecha: k,
        contenido: entryMap[k]?.contenido?.substring(0, 20)
      })));
    }
    
    // Construir array de 7 días
    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + idx);
      const iso = toLocalYMD(d);
      const entry = entryMap[iso];
      
      const dayName = dayNames[idx];
      const dayLabel = `${dayName} ${d.getDate()} ${months[d.getMonth()]}`;
      
      if (entry) {
        // Log para debugging de fotos
        if (entry.fotos && entry.fotos.length > 0) {
          console.log('📸 screen14: Entry tiene fotos:', {
            fecha: iso,
            fotosCount: entry.fotos.length,
            fotos: entry.fotos
          });
        }
        
        return {
          day: dayLabel,
          emotion: entry.emocion || null,
          emotionName: entry.emocion || null,
          photo: entry.fotos && entry.fotos.length > 0 ? '📸' : null, // Solo emoji, no el array
          text: entry.contenido || entry.titulo || 'Día completado',
          highlights: entry.tags || [],
          fecha: iso,
          entry: entry // Guardar entry completo para el PDF (incluye fotos reales)
        };
      } else {
        return {
          day: dayLabel,
          emotion: null,
          emotionName: null,
          photo: null,
          text: 'Día pendiente',
          highlights: [],
          fecha: iso,
          entry: null
        };
      }
    });
  }, [entries]);

  // Calcular semana actual
  const currentWeekNumber = getCurrentWeekNumber();
  const currentWeekRange = getCurrentWeekRange();

  // Construir datos de la semana con 7 días completos (buildWeekDays ya es useMemo)
  const weekDays = buildWeekDays;
  const weekData = {
    weekNumber: currentWeekNumber,
    dateRange: currentWeekRange,
    childName: 'Sofia',
    momName: 'Mamá',
    days: weekDays
  };


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
            {externalPdfUrl && (
              <View style={{ marginBottom: Spacing.lg }}>
                <Text style={styles.summaryTitle}>Último PDF generado</Text>
                <Text style={{ color: Colors.text.secondary, marginBottom: Spacing.sm, fontSize: 11 }}>
                  {externalPdfUrl.split('?')[0]}
                </Text>
              </View>
            )}
            {/* PDF Header */}
            <View style={styles.pdfHeader}>
              <Text style={styles.pdfTitle}>Mi Semana con Mamá</Text>
              <Text style={styles.pdfSubtitle}>Semana {weekData.weekNumber} ({weekData.dateRange})</Text>
              <Text style={styles.pdfChildName}>Por: {weekData.childName}</Text>
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
                    {(() => {
                      // Verificar si hay fotos disponibles
                      const fotos = day.entry?.fotos || [];
                      const hasPhotos = Array.isArray(fotos) && fotos.length > 0;
                      
                      console.log(`🔍 screen14: Día ${day.day} - hasPhotos:`, hasPhotos, 'fotos:', fotos);
                      
                      if (hasPhotos) {
                        console.log(`✅ screen14: Renderizando ${fotos.length} fotos para día ${day.day}`);
                        return (
                          <View style={styles.photoSection}>
                            <Text style={styles.photoText}>📸 Momentos especiales del día:</Text>
                            <ScrollView 
                              horizontal 
                              showsHorizontalScrollIndicator={true}
                              style={styles.photosScrollContainer}
                              contentContainerStyle={styles.photosScrollContent}
                              nestedScrollEnabled={true}
                            >
                              {fotos.map((photo, photoIdx) => {
                                const photoUrl = buildImageUrl(photo);
                                console.log(`🖼️ screen14: Renderizando foto ${photoIdx + 1}, URL:`, photoUrl, 'original:', photo);
                                if (!photoUrl) {
                                  console.warn(`⚠️ screen14: No se pudo construir URL para foto ${photoIdx + 1}:`, photo);
                                  return null;
                                }
                                
                                return (
                                  <View 
                                    key={`photo-${photoIdx}-${day.fecha || photoIdx}`} 
                                    style={styles.photoWrapper}
                                  >
                                    <Image
                                      source={{ uri: photoUrl }}
                                      style={styles.photoPreview}
                                      resizeMode="cover"
                                      onError={(e) => {
                                        console.error('❌ screen14: Error cargando foto:', photoUrl, e.nativeEvent?.error || e);
                                      }}
                                      onLoad={() => {
                                        console.log('✅ screen14: Foto cargada exitosamente y visible:', photoUrl);
                                      }}
                                      onLoadStart={() => {
                                        console.log('⏳ screen14: Cargando foto:', photoUrl);
                                      }}
                                    />
                                  </View>
                                );
                              })}
                            </ScrollView>
                          </View>
                        );
                      } else {
                        return (
                          <View style={styles.photoSection}>
                            <Text style={styles.photoIcon}>{day.photo || '📸'}</Text>
                            <Text style={styles.photoText}>Momento especial del día</Text>
                          </View>
                        );
                      }
                    })()}

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

                    {/* Sin acciones de edición en vista */}
                  </View>
                ) : (
                  <View style={styles.pendingDay}>
                    <Text style={styles.pendingText}>📝 Día pendiente</Text>
                    <Text style={styles.pendingSubtext}>Completa este día para incluirlo en tu libro</Text>
                    {/* Sin acciones desde vista */}
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
              title="📄 Generar PDF"
              onPress={handleGenerarPDF}
              variant="primary"
              style={styles.generateButton}
            />
            {externalPdfUrl ? (
              <Button
                title="🔗 Abrir PDF en navegador"
                onPress={async () => {
                  try {
                    const cleanUrl = externalPdfUrl.split('?')[0]; // Remover timestamp
                    console.log('🔗 Intentando abrir PDF:', cleanUrl);
                    
                    // Usar expo-web-browser que es más confiable para URLs HTTP/HTTPS
                    await WebBrowser.openBrowserAsync(cleanUrl, {
                      enableBarCollapsing: false,
                      showInRecents: true,
                    });
                    console.log('✅ PDF abierto exitosamente');
                  } catch (error) {
                    console.error('❌ Error al abrir PDF:', error);
                    // Fallback: intentar con Linking si WebBrowser falla
                    try {
                      const canOpen = await Linking.canOpenURL(cleanUrl);
                      if (canOpen) {
                        await Linking.openURL(cleanUrl);
                      } else {
                        throw new Error('No se puede abrir la URL');
                      }
                    } catch (linkError) {
                      Alert.alert(
                        'Error',
                        `No se pudo abrir el PDF:\n${error.message || linkError.message}\n\nURL: ${cleanUrl}\n\nPuedes copiar esta URL y abrirla manualmente en tu navegador.`,
                        [{ text: 'OK' }]
                      );
                    }
                  }
                }}
                variant="secondary"
              />
            ) : null}
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
    backgroundColor: '#FFF0F5',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
    minHeight: 150,
    width: '100%',
  },
  photoIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  photoText: {
    fontSize: FontSizes.md,
    color: '#FF6B9D',
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  photosScrollContainer: {
    marginTop: Spacing.sm,
    height: 130,
  },
  photosScrollContent: {
    paddingRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
  },
  photoWrapper: {
    marginRight: Spacing.sm,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    width: 120,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
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
