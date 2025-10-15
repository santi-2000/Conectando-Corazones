import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Inicio' }} />
      <Stack.Screen name="Biblioteca/screen1" options={{ title: 'Biblioteca' }} />
      <Stack.Screen name="Calendario/screen4" options={{ title: 'Calendario' }} />
      <Stack.Screen name="Directorio/screen6" options={{ title: 'Directorio' }} />
      <Stack.Screen name="Fafore/screen11" options={{ title: 'Fafore' }} />
      <Stack.Screen name="Moms-week/screen12" options={{ title: 'Moms Week' }} />
      <Stack.Screen name="Usuario/screen17" options={{ title: 'Usuario' }} />
    </Stack>
  );
}
