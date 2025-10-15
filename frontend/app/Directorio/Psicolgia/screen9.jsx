import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { Colors } from '../../../constants/colors';
import { FontSizes, Spacing } from '../../../constants/dimensions';

export default function ApoyosPsicologia() {
  const router = useRouter();
  const [selectedAssociation, setSelectedAssociation] = useState('Centro de Salud Mental');
  const [showDropdown, setShowDropdown] = useState(false);

  const associations = [
    {
      id: 'centro-salud-mental',
      name: 'Centro de Salud Mental',
      category: 'Psicologia',
      description: 'Atención psicológica especializada para todas las edades. Terapia individual, familiar y grupal. Tratamiento de ansiedad, depresión y trastornos del estado de ánimo.',
      contact: '(614) 789-0123',
      schedule: 'Lunes a viernes, 8:00 am - 6:00 pm'
    },
    {
      id: 'programa-terapia-familiar',
      name: 'Programa de Terapia Familiar',
      category: 'Psicologia',
      description: 'Terapia familiar especializada para resolver conflictos, mejorar la comunicación y fortalecer los vínculos familiares. Sesiones individuales y grupales.',
      contact: '(614) 890-1234',
      schedule: 'Lunes a sábado, 9:00 am - 5:00 pm'
    },
    {
      id: 'centro-psicologia-infantil',
      name: 'Centro de Psicología Infantil',
      category: 'Psicologia',
      description: 'Atención psicológica especializada para niños y adolescentes. Evaluación, diagnóstico y tratamiento de problemas de conducta, aprendizaje y desarrollo emocional.',
      contact: '(614) 901-2345',
      schedule: 'Lunes a viernes, 9:00 am - 4:00 pm'
    }
  ];

  const currentAssociation = associations.find(assoc => assoc.name === selectedAssociation) || associations[0];

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    console.log('Navegando al perfil');
  };

  const handleUbicacion = () => {
    console.log('Abrir ubicación');
  };

  const handleLlamar = () => {
    console.log('Llamar a la asociación');
  };

  const handleAssociationSelect = (association) => {
    setSelectedAssociation(association.name);
    setShowDropdown(false);
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

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Apoyos en Psicología</Text>
        </View>

        {/* Main Content Card */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {/* Seleccionar Asociación */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Seleccionar Asociacion</Text>
              <TouchableOpacity 
                style={styles.dropdownContainer}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={styles.dropdownText}>{selectedAssociation}</Text>
                <Text style={styles.dropdownIcon}>{showDropdown ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              
              {showDropdown && (
                <View style={styles.dropdownList}>
                  {associations.map((association) => (
                    <TouchableOpacity
                      key={association.id}
                      style={styles.dropdownItem}
                      onPress={() => handleAssociationSelect(association)}
                    >
                      <Text style={styles.dropdownItemText}>{association.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Categoría */}
            <Input
              label="Categoria"
              value={currentAssociation.category}
              editable={false}
            />

            {/* Descripción */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descripcion</Text>
              <View style={styles.textAreaContainer}>
                <Text style={styles.textAreaText}>
                  {currentAssociation.description}
                </Text>
              </View>
            </View>

            {/* Contacto */}
            <Input
              label="Contacto"
              value={currentAssociation.contact}
              editable={false}
            />

            {/* Horario */}
            <Input
              label="Horario"
              value={currentAssociation.schedule}
              editable={false}
            />

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <Button
                title="Ubicacion"
                onPress={handleUbicacion}
                variant="primary"
                style={styles.ubicacionButton}
              />

              <Button
                title="Llamar"
                onPress={handleLlamar}
                variant="secondary"
                style={styles.llamarButton}
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
  titleContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  ubicacionButton: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  llamarButton: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
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
    color: Colors.text.secondary,
  },
  dropdownList: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 4,
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
  textAreaContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 120,
  },
  textAreaText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    lineHeight: 22,
  },
});
