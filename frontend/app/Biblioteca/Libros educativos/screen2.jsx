import React from 'react';
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
import { Colors } from '../../../constants/colors';
import { FontSizes, Spacing } from '../../../constants/dimensions';

export default function LibrosEducativos() {
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

  const primaryBooks = [
    'Libro Español',
    'Libro Matematicas',
    'Libro Ciencias naturales',
    'Libro Historia',
    'Libro civica y etica'
  ];

  const secondaryBooks = [
    'Libro Español',
    'Libro Matematicas',
    'Libro Ciencias naturales',
    'Libro Historia',
    'Libro civica y etica'
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

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Libros Educativos</Text>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Primary Level Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PDFs descargables nivel Primaria</Text>
            {primaryBooks.map((book, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bookButton}
                onPress={() => handleBookPress(book)}
              >
                <Text style={styles.bookButtonText}>{book}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Secondary Level Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PDFs descargables nivel Secundaria</Text>
            {secondaryBooks.map((book, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bookButton}
                onPress={() => handleBookPress(book)}
              >
                <Text style={styles.bookButtonText}>{book}</Text>
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text.primary,
    textAlign: 'center',
  },
});
