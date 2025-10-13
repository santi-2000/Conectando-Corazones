import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const navigateToScreen = (screenNumber: number) => {
    router.push(`/screen${screenNumber}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conectando Corazones</Text>
      <Text style={styles.subtitle}>Navegación a 18 pantallas</Text>
      
      <View style={styles.navigationGrid}>
        {Array.from({ length: 18 }, (_, i) => (
          <TouchableOpacity 
            key={i + 1} 
            style={styles.navButton}
            onPress={() => navigateToScreen(i + 1)}
          >
            <Text style={styles.navButtonText}>Pantalla {i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navButton: {
    width: '30%',
    backgroundColor: '#007AFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
