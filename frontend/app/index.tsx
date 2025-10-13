import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conectando Corazones</Text>
      <Text style={styles.subtitle}>Navegación a 18 pantallas</Text>
      
      <View style={styles.navigationGrid}>
        {Array.from({ length: 18 }, (_, i) => (
          <Link key={i + 1} href={`/screen${i + 1}`} asChild>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>Pantalla {i + 1}</Text>
            </TouchableOpacity>
          </Link>
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
