import React from 'react';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import PWAInstaller from '../components/PWAInstaller';
import OfflineIndicator from '../components/OfflineIndicator';
import { UserProvider } from '../contexts/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      {Platform.OS === 'web' && <PWAInstaller />}
      {Platform.OS === 'web' && <OfflineIndicator />}
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="test-navigation" options={{ title: 'Test Navigation', headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'Inicio' }} />
        
        {/* Biblioteca */}
        <Stack.Screen name="Biblioteca/screen1" options={{ title: 'Biblioteca' }} />
        <Stack.Screen name="Biblioteca/Libros educativos/screen2" options={{ title: 'Libros Educativos' }} />
        <Stack.Screen name="Biblioteca/Libros legibles/screen3" options={{ title: 'Lecturas Infantiles' }} />
        
        {/* Calendario */}
        <Stack.Screen name="Calendario/screen4" options={{ title: 'Calendario' }} />
        <Stack.Screen name="Calendario/Newdate/screen5" options={{ title: 'Nueva Fecha' }} />
        
        {/* Directorio */}
        <Stack.Screen name="Directorio/screen6" options={{ title: 'Directorio' }} />
        <Stack.Screen name="Directorio/Alimentacion/screen7" options={{ title: 'Alimentación' }} />
        <Stack.Screen name="Directorio/Comunitario-legal/screen8" options={{ title: 'Legal y Comunitario' }} />
        <Stack.Screen name="Directorio/Psicolgia/screen9" options={{ title: 'Psicología' }} />
        <Stack.Screen name="Directorio/Salud/screen10" options={{ title: 'Salud' }} />
        
        {/* Fafore */}
        <Stack.Screen name="Fafore/screen11" options={{ title: 'Fafore' }} />
        
        {/* Moms Week */}
        <Stack.Screen name="Moms-week/screen12" options={{ title: 'Moms Week' }} />
        <Stack.Screen name="Moms-week/TodaysActivity/screen13" options={{ title: 'Actividad de Hoy', headerShown: false }} />
        <Stack.Screen name="Moms-week/ViewPdf/screen14" options={{ title: 'Vista PDF', headerShown: false }} />
        <Stack.Screen name="Moms-week/ViewPreviuosDays/screen15" options={{ title: 'Días Anteriores', headerShown: false }} />
        <Stack.Screen name="Moms-week/ViewPreviuosDays/edit/screen16" options={{ title: 'Editar Día', headerShown: false }} />
        
        {/* Usuario */}
        <Stack.Screen name="Usuario/screen17" options={{ title: 'Usuario' }} />
        
        {/* Admin */}
        <Stack.Screen name="Admin/Statistics" options={{ title: 'Estadísticas', headerShown: false }} />
        
        <Stack.Screen name="screen18" options={{ title: 'Pantalla 18' }} />
      </Stack>
    </UserProvider>
  );
}
