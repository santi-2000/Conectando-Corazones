import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { Colors } from '../constants/colors';
import { FontSizes, Spacing } from '../constants/dimensions';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Solo ejecutar en web
    if (Platform.OS !== 'web') {
      return;
    }

    // Verificar si window existe
    if (typeof window === 'undefined') {
      return;
    }

    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    // Agregar event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Mostrar el prompt de instalación
      deferredPrompt.prompt();
      
      // Esperar la respuesta del usuario
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la app');
      } else {
        console.log('Usuario rechazó instalar la app');
      }
      
      // Limpiar el prompt
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error('Error al instalar la app:', error);
      Alert.alert('Error', 'No se pudo instalar la aplicación');
    }
  };

  const handleIOSInstall = () => {
    Alert.alert(
      'Instalar App',
      'Para instalar esta app en iOS:\n\n1. Toca el botón "Compartir" en Safari\n2. Selecciona "Agregar a pantalla de inicio"\n3. Toca "Agregar"',
      [{ text: 'Entendido' }]
    );
  };

  // No mostrar nada si ya está instalado
  if (isInstalled) {
    return null;
  }

  // No mostrar en plataformas nativas
  if (Platform.OS !== 'web') {
    return null;
  }

  // No mostrar en web si no hay prompt disponible
  if (!showInstallButton) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.content}>
          <Text style={styles.title}>📱 Instalar App</Text>
          <Text style={styles.description}>
            Instala Conectando Corazones para acceso rápido y funcionamiento offline
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.installButton}
          onPress={Platform.OS === 'ios' ? handleIOSInstall : handleInstallClick}
        >
          <Text style={styles.installButtonText}>
            {Platform.OS === 'ios' ? 'Instalar' : 'Instalar App'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  banner: {
    backgroundColor: Colors.brand.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  description: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 16,
  },
  installButton: {
    backgroundColor: 'white',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  installButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.brand.primary,
  },
});
