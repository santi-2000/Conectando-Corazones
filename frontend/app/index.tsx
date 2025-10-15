import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const navigateToScreen = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conectando Corazones</Text>
      <Text style={styles.subtitle}>Navegación a 18 pantallas</Text>
      
      <View style={styles.navigationGrid}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateToScreen('/Biblioteca/screen1')}
        >
          <Text style={styles.navButtonText}>Biblioteca</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateToScreen('/Calendario/screen4')}
        >
          <Text style={styles.navButtonText}>Calendario</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateToScreen('/Directorio/screen6')}
        >
          <Text style={styles.navButtonText}>Directorio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateToScreen('/Fafore/screen11')}
        >
          <Text style={styles.navButtonText}>Fafore</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateToScreen('/Moms-week/screen12')}
        >
          <Text style={styles.navButtonText}>Moms Week</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateToScreen('/Usuario/screen17')}
        >
          <Text style={styles.navButtonText}>Usuario</Text>
        </TouchableOpacity>
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
    width: '48%',
    backgroundColor: '#007AFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
