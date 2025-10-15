import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSizes } from '../constants/dimensions';

export default function Logo({ 
  showText = true, 
  size = 'large',
  style 
}) {
  const [imageError, setImageError] = useState(true); // Iniciar con fallback
  
  const sizeStyles = {
    small: { width: 60, height: 45, scale: 1 },
    medium: { width: 80, height: 60, scale: 1.3 },
    large: { width: 200, height: 80, scale: 2 }
  };

  const imageStyle = [
    styles.logoImage,
    sizeStyles[size],
    style
  ];

  const handleImageError = () => {
    setImageError(true);
  };

  // Intentar cargar imagen solo si existe
  const tryLoadImage = () => {
    try {
      require('../assets/images/logo-fafore.png');
      setImageError(false);
    } catch {
      setImageError(true);
    }
  };

  // Verificar si la imagen existe al montar el componente
  React.useEffect(() => {
    tryLoadImage();
  }, []);

  return (
    <View style={styles.container}>
      {!imageError ? (
        <Image 
          source={require('../assets/images/logo-fafore.png')} 
          style={imageStyle}
          resizeMode="contain"
          onError={handleImageError}
        />
      ) : (
        <View style={[styles.fallbackContainer, { width: sizeStyles[size].width, height: sizeStyles[size].height }]}>
          <View style={[styles.logoGraphic, { transform: [{ scale: sizeStyles[size].scale }] }]}>
            <View style={styles.logoShape1} />
            <View style={styles.logoShape2} />
            <View style={styles.logoShape3} />
          </View>
        </View>
      )}
      {showText && (
        <Text style={styles.logoText}>FAFORE</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoImage: {
    marginBottom: 10,
  },
  fallbackContainer: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGraphic: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoShape1: {
    width: 20,
    height: 20,
    backgroundColor: Colors.brand.yellow,
    borderRadius: 4,
    marginRight: 5,
  },
  logoShape2: {
    width: 15,
    height: 25,
    backgroundColor: Colors.brand.orange,
    borderRadius: 8,
    marginRight: 5,
  },
  logoShape3: {
    width: 18,
    height: 18,
    backgroundColor: Colors.brand.purple,
    borderRadius: 9,
  },
  logoText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    letterSpacing: 2,
  },
});
