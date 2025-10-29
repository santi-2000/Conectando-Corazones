import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../constants/colors';
import { FontSizes, Spacing } from '../../../constants/dimensions';
import { useEducationalBooks } from '../../../Hooks/useEducationalBooks';

export default function LibrosEducativos() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState('primaria');
  
  // Hook para obtener libros del backend
  const { 
    books, 
    loading, 
    error, 
    fetchBooks 
  } = useEducationalBooks();

  useEffect(() => {
    // Cargar libros al montar el componente
    fetchBooks();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    console.log('Navegando al perfil');
  };

  const handleBookPress = (book) => {
    console.log('Descargando libro:', book.title);
    Alert.alert(
      'Descargar Libro',
      `¿Deseas descargar "${book.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Descargar', 
          onPress: () => {
            downloadBook(book);
          }
        }
      ]
    );
  };

  const downloadBook = async (book) => {
    try {
      // Mostrar indicador de carga
      Alert.alert('Descargando...', 'Preparando descarga...');
      
      // Usar la URL real del archivo desde la base de datos
      let pdfUrl = book.archivoUrl || book.fileUrl || book.archivo_url;
      
      // Si no hay URL en la base de datos, usar URL de ejemplo para demostración
      if (!pdfUrl) {
        // Crear URL de ejemplo basada en el título del libro
        const titleSlug = book.title?.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-');
        pdfUrl = `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;
      }

      // Verificar si se puede abrir la URL
      const canOpen = await Linking.canOpenURL(pdfUrl);
      
      if (canOpen) {
        // Abrir la URL en el navegador para descargar
        await Linking.openURL(pdfUrl);
        Alert.alert(
          'Descarga Iniciada', 
          `El archivo "${book.title}" se abrirá en tu navegador para descargar.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error', 
          'No se puede abrir el enlace de descarga.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error al descargar libro:', error);
      Alert.alert(
        'Error', 
        'Hubo un problema al descargar el libro. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };

  // Filtrar libros por nivel
  const primaryBooks = books?.filter(book => {
    const title = book.title?.toLowerCase() || '';
    const level = book.level?.toLowerCase() || '';
    const subject = book.subject?.toLowerCase() || '';
    
    // Excluir libros de secundaria explícitamente
    if (title.includes('secundaria')) {
      return false;
    }
    
    // Incluir libros de primaria
    return level.includes('primaria') || 
           subject.includes('primaria') ||
           title.includes('primaria') ||
           title.includes('grado');
  }) || [];

  const secondaryBooks = books?.filter(book => {
    const title = book.title?.toLowerCase() || '';
    const level = book.level?.toLowerCase() || '';
    const subject = book.subject?.toLowerCase() || '';
    
    // Incluir libros de secundaria
    return level.includes('secundaria') || 
           subject.includes('secundaria') ||
           title.includes('secundaria');
  }) || [];

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
          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Cargando libros...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchBooks}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Primary Level Section */}
          {!loading && !error && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📚 PDFs descargables nivel Primaria</Text>
              {primaryBooks.length > 0 ? (
                primaryBooks.map((book, index) => (
                  <TouchableOpacity
                    key={book.id || index}
                    style={styles.bookButton}
                    onPress={() => handleBookPress(book)}
                  >
                    <Text style={styles.bookButtonText}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                    <Text style={styles.bookSubject}>{book.subject}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noBooksText}>No hay libros de primaria disponibles</Text>
              )}
            </View>
          )}

          {/* Secondary Level Section */}
          {!loading && !error && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📖 PDFs descargables nivel Secundaria</Text>
              {secondaryBooks.length > 0 ? (
                secondaryBooks.map((book, index) => (
                  <TouchableOpacity
                    key={book.id || index}
                    style={styles.bookButton}
                    onPress={() => handleBookPress(book)}
                  >
                    <Text style={styles.bookButtonText}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                    <Text style={styles.bookSubject}>{book.subject}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noBooksText}>No hay libros de secundaria disponibles</Text>
              )}
            </View>
          )}

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
    marginBottom: 4,
  },
  bookAuthor: {
    color: Colors.text.secondary,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginBottom: 2,
  },
  bookSubject: {
    color: Colors.text.tertiary,
    fontSize: FontSizes.xs,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    color: Colors.text.primary,
    fontSize: FontSizes.md,
    marginTop: Spacing.md,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  noBooksText: {
    color: Colors.text.secondary,
    fontSize: FontSizes.md,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: Spacing.lg,
  },
});
