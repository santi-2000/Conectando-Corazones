import { View, Text, StyleSheet } from 'react-native';

export default function Screen5() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla 5</Text>
      <Text style={styles.subtitle}>Contenido pendiente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
