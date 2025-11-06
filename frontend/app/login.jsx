import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/Button';
import Input from '../components/Input';
import Logo from '../components/Logo';
import { Colors } from '../constants/colors';
import { FontSizes, Spacing, ScreenDimensions } from '../constants/dimensions';
import { useAuth } from '../Hooks/useAuth';
import { CONFIG } from '../constants/config';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    try {
      setIsLoggingIn(true);
      console.log('🔐 Login: Intentando iniciar sesión...');
      console.log('🌐 Backend URL:', CONFIG.API_BASE_URL);
      console.log('👤 Usuario:', username);
      
      const result = await login(username, password);
      
      if (result.success) {
        console.log('✅ Login exitoso:', result.user);
        Alert.alert('Éxito', 'Inicio de sesión exitoso', [
          { text: 'OK', onPress: () => router.push('/home') }
        ]);
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      Alert.alert(
        'Error de inicio de sesión',
        error.message || 'No se pudo iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateAccount = () => {
    // Navegar a pantalla de registro
    console.log('Crear cuenta');
  };

  const handleProfile = () => {
    router.push('/Usuario/screen17');
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={[Colors.gradient.start, Colors.gradient.end]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Conectando Corazones</Text>
            <View style={styles.heartIcon}>
              <Text style={styles.heartEmoji}>❤️</Text>
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>Inicio de Sesión</Text>
            
            <Input
              placeholder="Usuario"
              value={username}
              onChangeText={setUsername}
            />

            <Input
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity 
              style={styles.createAccountLink}
              onPress={handleCreateAccount}
            >
              <Text style={styles.createAccountText}>Crear cuenta</Text>
            </TouchableOpacity>

            <Button
              title={isLoggingIn ? "Iniciando sesión..." : "Sign in"}
              onPress={handleLogin}
              variant="primary"
              disabled={isLoggingIn}
            />
            
            {/* Debug info en desarrollo */}
            {__DEV__ && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugText}>
                  Backend: {CONFIG.API_BASE_URL}
                </Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Logo size="large" />

          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: ScreenDimensions.isSmallDevice ? 40 : 60,
    paddingHorizontal: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  heartIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heartEmoji: {
    fontSize: 30,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: ScreenDimensions.isSmallDevice ? Spacing.lg : 30,
    paddingVertical: Spacing.xl,
  },
  loginTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  createAccountLink: {
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  createAccountText: {
    color: Colors.button.secondary,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  logoSubtext: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  debugContainer: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  debugText: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
