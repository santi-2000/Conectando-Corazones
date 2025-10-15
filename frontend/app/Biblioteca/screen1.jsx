import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontSizes, Spacing } from '../../constants/dimensions';

export default function BibliotecaEscolar() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    console.log('Navegando al perfil');
  };

  const handleLibrosEducativos = () => {
    router.push('/Biblioteca/Libros educativos/screen2');
  };

  const handleLecturasInfantiles = () => {
    router.push('/Biblioteca/Libros legibles/screen3');
  };

  const handleImageError = () => {
    setImageError(true);
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
          <Text style={styles.title}>Biblioteca Escolar</Text>
          <View style={styles.titleIcon}>
            {!imageError ? (
              <Image
                source={require('../../assets/images/home/iblioteca-escolar.png')}
                style={styles.titleIconImage}
                resizeMode="contain"
                onError={handleImageError}
              />
            ) : (
              <Text style={styles.titleIconText}>📚</Text>
            )}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={handleLibrosEducativos}
          >
            <Text style={styles.categoryButtonText}>Libros Educativos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryButton}
            onPress={handleLecturasInfantiles}
          >
            <Text style={styles.categoryButtonText}>Lecturas Infantiles y juveniles</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginRight: Spacing.md,
  },
  titleIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  titleIconText: {
    fontSize: 24,
  },
  titleIconImage: {
    width: 30,
    height: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  categoryButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
  },
});
