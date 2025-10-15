import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import HomeButton from '../components/HomeButton';
import { Colors } from '../constants/colors';
import { FontSizes, Spacing } from '../constants/dimensions';

export default function HomeScreen() {
  const router = useRouter();

  const navigateToScreen = (route) => {
    router.push(route);
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
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerIcon}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* 2x2 Grid of Buttons */}
          <View style={styles.gridContainer}>
            <HomeButton
              title="Directorio apoyos"
              iconName="directorio-apoyos"
              onPress={() => navigateToScreen('/Directorio/screen6')}
            />

            <HomeButton
              title="Biblioteca Escolar"
              iconName="biblioteca-escolar"
              onPress={() => navigateToScreen('/Biblioteca/screen1')}
            />

            <HomeButton
              title="Calendario"
              iconName="calendario"
              onPress={() => navigateToScreen('/Calendario/screen4')}
            />

            <HomeButton
              title="Mi Semana con Mamá ❤️"
              iconName="mi-semana-mama"
              onPress={() => navigateToScreen('/Moms-week/screen12')}
            />
          </View>

          {/* FAFORE Logo Button */}
          <TouchableOpacity 
            style={styles.faforeButton}
            onPress={() => navigateToScreen('/Fafore/screen11')}
          >
            <Image 
              source={require('../assets/images/logo-fafore.png')} 
              style={styles.faforeLogo}
              resizeMode="contain"
            />
            <View style={styles.faforeTextContainer}>
              <Text style={styles.faforeText}>FAFORE</Text>
              <Text style={styles.faforeSubtext}>Familia, Fortaleza Y Reinserción A.C.</Text>
            </View>
          </TouchableOpacity>

          {/* Estadísticas Button */}
          <TouchableOpacity 
            style={styles.statsButton}
            onPress={() => navigateToScreen('/Usuario/screen17')}
          >
            <Text style={styles.statsButtonText}>Estadísticas</Text>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  faforeButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  faforeLogo: {
    width: 60,
    height: 40,
    marginRight: Spacing.md,
  },
  faforeTextContainer: {
    flex: 1,
  },
  faforeText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  faforeSubtext: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
  },
  statsButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsButtonText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
});
