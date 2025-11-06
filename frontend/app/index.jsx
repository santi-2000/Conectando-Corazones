import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir inmediatamente al login sin mostrar "Unmatched Route"
    // Usar setTimeout para asegurar que el router esté listo
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  // Mostrar un loader mientras redirige (muy rápido, casi imperceptible)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8B1A8B' }}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}
