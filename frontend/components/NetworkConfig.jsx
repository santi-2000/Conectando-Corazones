import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNetworkConfig } from '../Hooks/useNetworkConfig';

/**
 * Componente para configurar la conexión de red
 * Permite al usuario configurar manualmente la IP o detectarla automáticamente
 */
const NetworkConfig = ({ onConfigChange }) => {
  const { apiBaseUrl, isLoading, error, setCustomIP, resetToLocalhost, detectNetworkIP } = useNetworkConfig();
  const [customIP, setCustomIPInput] = useState('');
  const [showManualConfig, setShowManualConfig] = useState(false);

  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(apiBaseUrl);
    }
  }, [apiBaseUrl, onConfigChange]);

  const handleAutoDetect = async () => {
    try {
      await detectNetworkIP();
      Alert.alert('Éxito', 'IP detectada automáticamente');
    } catch (err) {
      Alert.alert('Error', 'No se pudo detectar la IP automáticamente');
    }
  };

  const handleManualConfig = () => {
    if (customIP.trim()) {
      setCustomIP(customIP.trim());
      setShowManualConfig(false);
      Alert.alert('Éxito', `IP configurada: ${customIP.trim()}`);
    } else {
      Alert.alert('Error', 'Por favor ingresa una IP válida');
    }
  };

  const handleReset = () => {
    resetToLocalhost();
    setCustomIPInput('');
    setShowManualConfig(false);
    Alert.alert('Reseteado', 'Configuración restaurada a localhost');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Detectando configuración de red...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de Red</Text>
      
      <View style={styles.currentConfig}>
        <Text style={styles.label}>URL actual:</Text>
        <Text style={styles.urlText}>{apiBaseUrl}</Text>
      </View>

      {error && (
        <Text style={styles.errorText}>Error: {error}</Text>
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleAutoDetect}
        >
          <Text style={styles.buttonText}>🔍 Auto-detectar IP</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowManualConfig(!showManualConfig)}
        >
          <Text style={styles.buttonText}>⚙️ Configurar manualmente</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>🔄 Resetear a localhost</Text>
        </TouchableOpacity>
      </View>

      {showManualConfig && (
        <View style={styles.manualConfig}>
          <Text style={styles.label}>Ingresa la IP del servidor:</Text>
          <TextInput
            style={styles.input}
            value={customIP}
            onChangeText={setCustomIPInput}
            placeholder="Ej: 192.168.1.100"
            keyboardType="numeric"
            autoCapitalize="none"
          />
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={handleManualConfig}
          >
            <Text style={styles.buttonText}>✅ Aplicar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>💡 Ayuda:</Text>
        <Text style={styles.helpText}>
          • <Text style={styles.bold}>Auto-detectar:</Text> Intenta encontrar automáticamente la IP del servidor
        </Text>
        <Text style={styles.helpText}>
          • <Text style={styles.bold}>Manual:</Text> Ingresa la IP que aparece en la consola del servidor
        </Text>
        <Text style={styles.helpText}>
          • <Text style={styles.bold}>Resetear:</Text> Vuelve a usar localhost (solo para desarrollo)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  currentConfig: {
    backgroundColor: '#e8f4f8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  urlText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#2c3e50',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonsContainer: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  manualConfig: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  helpContainer: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 5,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  helpText: {
    fontSize: 12,
    marginBottom: 3,
    lineHeight: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default NetworkConfig;
