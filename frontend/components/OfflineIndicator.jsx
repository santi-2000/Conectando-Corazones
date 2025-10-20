import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform
} from 'react-native';
import { Colors } from '../constants/colors';
import { FontSizes, Spacing } from '../constants/dimensions';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Solo ejecutar en web
    if (Platform.OS !== 'web') {
      return;
    }

    // Verificar si window y navigator existen
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    const handleOnline = () => {
      setIsOnline(true);
      showMessage('Conexión restaurada', true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      showMessage('Sin conexión - funcionando offline', false);
    };

    // Verificar estado inicial
    setIsOnline(navigator.onLine);

    // Agregar event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showMessage = (message, isSuccess) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // No mostrar en plataformas nativas
  if (Platform.OS !== 'web') {
    return null;
  }

  if (isOnline) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.indicator}>
        <Text style={styles.icon}>📡</Text>
        <Text style={styles.text}>Sin conexión</Text>
        <Text style={styles.subtext}>Funcionando offline</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 1000,
  },
  indicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  text: {
    color: 'white',
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    marginRight: Spacing.sm,
  },
  subtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FontSizes.xs,
  },
});
