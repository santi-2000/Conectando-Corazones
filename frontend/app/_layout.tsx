import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Inicio' }} />
      <Stack.Screen name="home/index" options={{ title: 'Home' }} />
      
      {/* Biblioteca */}
      <Stack.Screen name="Biblioteca/screen1" options={{ title: 'Biblioteca' }} />
      <Stack.Screen name="Biblioteca/Libros educativos/screen2" options={{ title: 'Libros Educativos' }} />
      <Stack.Screen name="Biblioteca/Libros legibles/screen3" options={{ title: 'Libros Legibles' }} />
      
      {/* Calendario */}
      <Stack.Screen name="Calendario/screen4" options={{ title: 'Calendario' }} />
      <Stack.Screen name="Calendario/Newdate/screen5" options={{ title: 'Nueva Fecha' }} />
      
      {/* Directorio */}
      <Stack.Screen name="Directorio/screen6" options={{ title: 'Directorio' }} />
      <Stack.Screen name="Directorio/Alimentacion/screen7" options={{ title: 'Alimentación' }} />
      <Stack.Screen name="Directorio/Comunitario-legal/screen8" options={{ title: 'Comunitario Legal' }} />
      <Stack.Screen name="Directorio/Psicolgia/screen9" options={{ title: 'Psicología' }} />
      <Stack.Screen name="Directorio/Salud/screen10" options={{ title: 'Salud' }} />
      
      {/* Fafore */}
      <Stack.Screen name="Fafore/screen11" options={{ title: 'Fafore' }} />
      
      {/* Moms-week */}
      <Stack.Screen name="Moms-week/screen12" options={{ title: 'Moms Week' }} />
      <Stack.Screen name="Moms-week/TodaysActivity/screen13" options={{ title: 'Actividad de Hoy' }} />
      <Stack.Screen name="Moms-week/ViewPdf/screen14" options={{ title: 'Ver PDF' }} />
      <Stack.Screen name="Moms-week/ViewPreviuosDays/screen15" options={{ title: 'Ver Días Anteriores' }} />
      <Stack.Screen name="Moms-week/ViewPreviuosDays/edit/screen16" options={{ title: 'Editar' }} />
      
      {/* Usuario */}
      <Stack.Screen name="Usuario/screen17" options={{ title: 'Usuario' }} />
      
      {/* Pantalla suelta */}
      <Stack.Screen name="screen18" options={{ title: 'Pantalla 18' }} />
    </Stack>
  );
}
