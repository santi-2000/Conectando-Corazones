import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontSizes, Spacing } from '../../constants/dimensions';

export default function FaforeScreen() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleProfile = () => {
    router.push('/Usuario/screen17');
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsite = (url) => {
    Linking.openURL(url);
  };

  const handleLocation = () => {
    // Aquí iría la lógica para abrir mapas
    console.log('Abrir ubicación en mapas');
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

        {/* Main Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            {!imageError ? (
              <Image 
                source={require('../../assets/images/logo-fafore.png')} 
                style={styles.logo}
                resizeMode="contain"
                onError={handleImageError}
              />
            ) : (
              <View style={styles.logoFallback}>
                <Text style={styles.logoText}>FAFORE</Text>
              </View>
            )}
            <Text style={styles.organizationName}>FAFORE</Text>
            <Text style={styles.organizationSubtitle}>Familia, Fortaleza Y Reinserción A.C.</Text>
          </View>

          {/* Mission Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Nuestra Misión</Text>
            <Text style={styles.sectionContent}>
              Trabajamos para fortalecer los lazos familiares y apoyar la reinserción social, 
              brindando herramientas y recursos que promuevan el bienestar integral de las familias 
              y comunidades.
            </Text>
          </View>

          {/* Vision Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👁️ Nuestra Visión</Text>
            <Text style={styles.sectionContent}>
              Ser una organización líder en la promoción de la unidad familiar y la reinserción social, 
              creando un impacto positivo y duradero en las comunidades que servimos.
            </Text>
          </View>

          {/* Values Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💎 Nuestros Valores</Text>
            <View style={styles.valuesList}>
              <Text style={styles.valueItem}>• Solidaridad y Compromiso</Text>
              <Text style={styles.valueItem}>• Respeto y Dignidad</Text>
              <Text style={styles.valueItem}>• Transparencia y Honestidad</Text>
              <Text style={styles.valueItem}>• Trabajo en Equipo</Text>
              <Text style={styles.valueItem}>• Innovación Social</Text>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📞 Información de Contacto</Text>
            
            <View style={styles.contactCard}>
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => handleCall('+52 55 1234 5678')}
              >
                <Text style={styles.contactIcon}>📞</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Teléfono</Text>
                  <Text style={styles.contactValue}>+52 55 1234 5678</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => handleEmail('contacto@fafore.org')}
              >
                <Text style={styles.contactIcon}>✉️</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>contacto@fafore.org</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => handleWebsite('https://www.fafore.org')}
              >
                <Text style={styles.contactIcon}>🌐</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Sitio Web</Text>
                  <Text style={styles.contactValue}>www.fafore.org</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactItem}
                onPress={handleLocation}
              >
                <Text style={styles.contactIcon}>📍</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Dirección</Text>
                  <Text style={styles.contactValue}>Av. Reforma 123, CDMX</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Services Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛠️ Nuestros Servicios</Text>
            <View style={styles.servicesList}>
              <View style={styles.serviceItem}>
                <Text style={styles.serviceIcon}>👨‍👩‍👧‍👦</Text>
                <Text style={styles.serviceText}>Apoyo Familiar</Text>
              </View>
              <View style={styles.serviceItem}>
                <Text style={styles.serviceIcon}>📚</Text>
                <Text style={styles.serviceText}>Educación</Text>
              </View>
              <View style={styles.serviceItem}>
                <Text style={styles.serviceIcon}>🏥</Text>
                <Text style={styles.serviceText}>Salud</Text>
              </View>
              <View style={styles.serviceItem}>
                <Text style={styles.serviceIcon}>⚖️</Text>
                <Text style={styles.serviceText}>Asesoría Legal</Text>
              </View>
              <View style={styles.serviceItem}>
                <Text style={styles.serviceIcon}>🤝</Text>
                <Text style={styles.serviceText}>Reinserción Social</Text>
              </View>
              <View style={styles.serviceItem}>
                <Text style={styles.serviceIcon}>💼</Text>
                <Text style={styles.serviceText}>Desarrollo Laboral</Text>
              </View>
            </View>
          </View>

          {/* Schedule Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕒 Horarios de Atención</Text>
            <View style={styles.scheduleCard}>
              <Text style={styles.scheduleText}>Lunes a Viernes: 9:00 AM - 6:00 PM</Text>
              <Text style={styles.scheduleText}>Sábados: 9:00 AM - 2:00 PM</Text>
              <Text style={styles.scheduleText}>Domingos: Cerrado</Text>
            </View>
          </View>

          {/* Legal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Información Legal</Text>
            <View style={styles.legalCard}>
              <Text style={styles.legalText}>Registro ante SAT: RFC FAF123456789</Text>
              <Text style={styles.legalText}>Constitución: 15 de Marzo, 2020</Text>
              <Text style={styles.legalText}>Clave de Registro: FAF-2020-001</Text>
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  logo: {
    width: 120,
    height: 80,
    marginBottom: Spacing.md,
  },
  logoFallback: {
    width: 120,
    height: 80,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
  },
  organizationName: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  organizationSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  sectionContent: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  valuesList: {
    marginTop: Spacing.sm,
  },
  valueItem: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: Spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  contactIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    width: 30,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  contactValue: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  serviceIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  serviceText: {
    fontSize: FontSizes.sm,
    color: '#4A90E2',
    fontWeight: '500',
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  scheduleText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  legalCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  legalText: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
});
