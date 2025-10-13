import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const navigateToScreen = (route: string) => {
    router.push(route);
  };

  const sections = [
    {
      title: 'Biblioteca',
      screens: [
        { name: 'Biblioteca', route: '/Biblioteca/screen1' },
        { name: 'Libros Educativos', route: '/Biblioteca/Libros educativos/screen2' },
        { name: 'Libros Legibles', route: '/Biblioteca/Libros legibles/screen3' },
      ]
    },
    {
      title: 'Calendario',
      screens: [
        { name: 'Calendario', route: '/Calendario/screen4' },
        { name: 'Nueva Fecha', route: '/Calendario/Newdate/screen5' },
      ]
    },
    {
      title: 'Directorio',
      screens: [
        { name: 'Directorio', route: '/Directorio/screen6' },
        { name: 'Alimentación', route: '/Directorio/Alimentacion/screen7' },
        { name: 'Comunitario Legal', route: '/Directorio/Comunitario-legal/screen8' },
        { name: 'Psicología', route: '/Directorio/Psicolgia/screen9' },
        { name: 'Salud', route: '/Directorio/Salud/screen10' },
      ]
    },
    {
      title: 'Otros',
      screens: [
        { name: 'Fafore', route: '/Fafore/screen11' },
        { name: 'Moms Week', route: '/Moms-week/screen12' },
        { name: 'Actividad de Hoy', route: '/Moms-week/TodaysActivity/screen13' },
        { name: 'Ver PDF', route: '/Moms-week/ViewPdf/screen14' },
        { name: 'Ver Días Anteriores', route: '/Moms-week/ViewPreviuosDays/screen15' },
        { name: 'Editar', route: '/Moms-week/ViewPreviuosDays/edit/screen16' },
        { name: 'Usuario', route: '/Usuario/screen17' },
        { name: 'Pantalla 18', route: '/screen18' },
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Conectando Corazones</Text>
      <Text style={styles.subtitle}>Navegación organizada por secciones</Text>
      
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionGrid}>
            {section.screens.map((screen, screenIndex) => (
              <TouchableOpacity 
                key={screenIndex} 
                style={styles.navButton}
                onPress={() => navigateToScreen(screen.route)}
              >
                <Text style={styles.navButtonText}>{screen.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  sectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navButton: {
    width: '48%',
    backgroundColor: '#007AFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
