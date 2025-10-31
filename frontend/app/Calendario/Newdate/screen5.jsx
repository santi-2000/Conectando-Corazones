import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { FontSizes, Spacing } from '../../../constants/dimensions';
import { useCalendar } from '../../../Hooks/useCalendar';

export default function AgregarFecha() {
  const router = useRouter();
  const { createEvent, loading } = useCalendar('test_review');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedColor, setSelectedColor] = useState('#4A90E2');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivelImportancia, setNivelImportancia] = useState('Alto');
  const [tipoEvento, setTipoEvento] = useState('diferente');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showImportancePicker, setShowImportancePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    router.push('/Usuario/screen17');
  };

  const handleSave = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título para el evento');
      return;
    }

    try {
      // Formatear fecha a ISO (YYYY-MM-DD)
      const fechaISO = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      
      const eventData = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        fecha_evento: fechaISO,
        color: selectedColor,
        tipo_evento: tipoEvento,
        nivel_importancia: nivelImportancia,
        recordatorio_activo: false,
        ubicacion: null,
        notas_adicionales: null
      };

      console.log('📅 Creando evento:', eventData);
      
      await createEvent(eventData);
      
      Alert.alert(
        '✅ Éxito', 
        'Evento creado exitosamente',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      console.error('❌ Error al crear evento:', error);
      Alert.alert('❌ Error', error.message || 'No se pudo crear el evento. Verifica tu conexión.');
    }
  };

  const handleDatePress = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const colors = [
    { name: 'Rojo', value: '#FF6B6B' },
    { name: 'Azul', value: '#4ECDC4' },
    { name: 'Verde', value: '#45B7D1' },
    { name: 'Amarillo', value: '#FFA07A' },
    { name: 'Morado', value: '#9B59B6' },
    { name: 'Naranja', value: '#E67E22' }
  ];

  const importanceLevels = ['Alto', 'Medio', 'Bajo'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Agregar días vacíos para alinear el primer día
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Agregar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
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

  const days = getDaysInMonth(selectedDate);

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

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Agregar Fecha</Text>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {/* Calendar Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Fecha</Text>
              
              {/* Calendar Widget */}
              <View style={styles.calendarWidget}>
                {/* Month Navigation */}
                <View style={styles.monthHeader}>
                  <TouchableOpacity style={styles.navButton} onPress={handlePreviousMonth}>
                    <Text style={styles.navIcon}>‹</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.monthInfo}>
                    <Text style={styles.monthText}>
                      {getMonthName(selectedDate)} {getYear(selectedDate)} ›
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

                    const isSelected = selectedDate.getDate() === day;
                    const isToday = new Date().getDate() === day && 
                                   new Date().getMonth() === selectedDate.getMonth() && 
                                   new Date().getFullYear() === selectedDate.getFullYear();

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
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Tipo de Evento Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tipo de Evento</Text>
              <TouchableOpacity 
                style={styles.dropdownContainer}
                onPress={() => setShowTypePicker(!showTypePicker)}
              >
                <Text style={styles.dropdownText}>
                  {eventTypes.find(t => t.value === tipoEvento)?.label || 'Seleccionar tipo'}
                </Text>
                <Text style={styles.dropdownIcon}>⌄</Text>
              </TouchableOpacity>
              
              {showTypePicker && (
                <View style={styles.dropdownList}>
                  {eventTypes.map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setTipoEvento(type.value);
                        setShowTypePicker(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{type.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Color Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Color</Text>
              <TouchableOpacity 
                style={styles.dropdownContainer}
                onPress={() => setShowColorPicker(!showColorPicker)}
              >
                <Text style={styles.dropdownText}>
                  {colors.find(c => c.value === selectedColor)?.name || 'Seleccionar color'}
                </Text>
                <Text style={styles.dropdownIcon}>⌄</Text>
              </TouchableOpacity>
              
              {showColorPicker && (
                <View style={styles.colorPicker}>
                  {colors.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.colorOption, 
                        { backgroundColor: color.value },
                        selectedColor === color.value && styles.colorOptionSelected
                      ]}
                      onPress={() => {
                        setSelectedColor(color.value);
                        setShowColorPicker(false);
                      }}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* Título Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Titulo</Text>
              <TextInput
                style={styles.textInput}
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ingresa el título del evento"
                placeholderTextColor="#999"
              />
            </View>

            {/* Descripción Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descripcion</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Describe el evento"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Nivel de Importancia Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nivel de importancia</Text>
              <TouchableOpacity 
                style={styles.dropdownContainer}
                onPress={() => setShowImportancePicker(!showImportancePicker)}
              >
                <Text style={styles.dropdownText}>{nivelImportancia}</Text>
                <Text style={styles.dropdownIcon}>⌄</Text>
              </TouchableOpacity>
              
              {showImportancePicker && (
                <View style={styles.dropdownList}>
                  {importanceLevels.map((level, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNivelImportancia(level);
                        setShowImportancePicker(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Save Button */}
            <Button
              title="Guardar Fecha"
              onPress={handleSave}
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
  titleContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  card: {
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  calendarWidget: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: Spacing.md,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  navButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
    color: '#6C757D',
    fontWeight: 'bold',
  },
  monthInfo: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.sm,
  },
  dayOfWeek: {
    fontSize: FontSizes.xs,
    color: '#6C757D',
    fontWeight: '500',
    textAlign: 'center',
    width: 40,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 40,
    height: 40,
    margin: 3,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDay: {
    width: 40,
    height: 40,
    margin: 3,
  },
  selectedDay: {
    backgroundColor: '#4A90E2',
  },
  todayDay: {
    backgroundColor: '#E6F4FE',
    borderWidth: 1,
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
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#999',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 2,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dropdownList: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: Spacing.lg,
  },
});
