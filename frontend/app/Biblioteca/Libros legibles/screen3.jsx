import React from 'react';
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

export default function LibrosInfantiles() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    console.log('Navegando al perfil');
  };

  const handleBookPress = (bookName) => {
    console.log('Descargando libro:', bookName);
    // Aquí iría la lógica para descargar el PDF
  };

  const handleLibraryClick = () => {
    console.log('Accediendo a biblioteca de libros');
    // Aquí iría la lógica para abrir la biblioteca
  };

  const infantBooks = [
    'Principito',
    'Cuentos de hadas',
    'Aventuras de piratas',
    'Animales del bosque',
    'Cuentos para dormir'
  ];

  const recommendedBooks = [
    'Thriller',
    'Misterio en la ciudad',
    'Aventuras espaciales',
    'Cuentos de terror',
    'Historias de amor'
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

        {/* Main Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Libros Infantiles</Text>
            <Text style={styles.subtitle}>Link para descargar libros gratis</Text>
          </View>

          {/* Library Card */}
          <TouchableOpacity style={styles.libraryCard} onPress={handleLibraryClick}>
            <View style={styles.libraryIcon}>
              <Text style={styles.libraryEmoji}>🏛️</Text>
            </View>
            <TouchableOpacity style={styles.clickButton}>
              <Text style={styles.clickButtonText}>Click</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Infant Books Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Libros infantiles recomendados</Text>
            {infantBooks.map((book, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bookButton}
                onPress={() => handleBookPress(book)}
              >
                <Text style={styles.bookButtonText}>{book}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.moreBooksText}>mas botones con mas libros</Text>
          </View>

          {/* Recommended Books Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Libros recomendados</Text>
            {recommendedBooks.map((book, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bookButton}
                onPress={() => handleBookPress(book)}
              >
                <Text style={styles.bookButtonText}>{book}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.moreBooksText}>mas botones con mas libros</Text>
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  titleSection: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  libraryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  libraryIcon: {
    marginBottom: Spacing.lg,
  },
  libraryEmoji: {
    fontSize: 60,
  },
  clickButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    borderColor: '#000',
  },
  clickButtonText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  bookButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  moreBooksText: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
});
