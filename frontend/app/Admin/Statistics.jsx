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
import { useUser } from '../../contexts/UserContext';
import { Colors } from '../../constants/colors';
import { FontSizes, Spacing } from '../../constants/dimensions';

export default function Statistics() {
  const router = useRouter();
  const { user, isAdmin } = useUser();

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    router.push('/Usuario/screen17');
  };

  // Si no es administrador, redirigir
  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedText}>No tienes permisos para acceder a esta sección</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
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

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>📊 Estadísticas</Text>
          <Text style={styles.subtitle}>Panel de Administración</Text>
        </View>

        {/* Statistics Cards */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.statsGrid}>
            {/* Usuarios Activos */}
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>👥</Text>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Usuarios Activos</Text>
            </View>

            {/* Eventos Creados */}
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Eventos Creados</Text>
            </View>

            {/* PDFs Creados */}
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📄</Text>
              <Text style={styles.statNumber}>25</Text>
              <Text style={styles.statLabel}>PDFs Creados</Text>
            </View>

            {/* Entradas Semanales */}
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📖</Text>
              <Text style={styles.statNumber}>29</Text>
              <Text style={styles.statLabel}>Entradas Semanales</Text>
            </View>
          </View>

          {/* Charts Section */}
          <View style={styles.chartsSection}>
            <Text style={styles.sectionTitle}>📈Estadisticas de Uso</Text>
            
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Actividad Mensual</Text>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartText}>📊 Gráfico de barras</Text>
                <Text style={styles.chartSubtext}>Octubre: 12 usuarios</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>PDFs Creados</Text>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartText}>📄 Reporte de PDFs</Text>
                <Text style={styles.chartSubtext}>Esta semana: 25 PDFs</Text>
                <Text style={styles.chartSubtext}>Este mes: 25 PDFs</Text>
                <Text style={styles.chartSubtext}>Total acumulado: 25 PDFs</Text>
              </View>
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
    marginBottom: Spacing.xl,
    alignItems: 'center',
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
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  statNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  chartsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  chartTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  chartPlaceholder: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  chartText: {
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  chartSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: Spacing.xl,
  },
  unauthorizedText: {
    fontSize: FontSizes.lg,
    color: 'white',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
});
