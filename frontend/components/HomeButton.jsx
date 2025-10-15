import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSizes, Spacing } from '../constants/dimensions';

export default function HomeButton({ 
  title, 
  onPress, 
  iconName,
  style 
}) {
  const [imageError, setImageError] = useState(false);

  const getImageSource = (iconName) => {
    const imageMap = {
      'directorio-apoyos': require('../assets/images/home/directorio-apoyos.png'),
      'biblioteca-escolar': require('../assets/images/home/iblioteca-escolar.png'),
      'calendario': require('../assets/images/home/calendario corazon.png'),
      'mi-semana-mama': require('../assets/images/home/mi-semana-mama.png')
    };
    return imageMap[iconName];
  };

  const getFallbackIcon = (iconName) => {
    const icons = {
      'directorio-apoyos': '🤝',
      'biblioteca-escolar': '📚',
      'calendario': '📅',
      'mi-semana-mama': '📖'
    };
    return icons[iconName] || '📱';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <TouchableOpacity 
      style={[styles.button, style]}
      onPress={onPress}
    >
      {!imageError ? (
        <Image 
          source={getImageSource(iconName)}
          style={styles.fullButtonImage}
          resizeMode="cover"
          onError={handleImageError}
        />
      ) : (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackIcon}>{getFallbackIcon(iconName)}</Text>
        </View>
      )}
      
      <View style={styles.label}>
        <Text style={styles.labelText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '48%',
    height: 140,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: '#000000',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  fullButtonImage: {
    width: '90%',
    height: '90%',
    position: 'absolute',
    top: '5%',
    left: '5%',
  },
  fallbackContainer: {
    width: '90%',
    height: '90%',
    position: 'absolute',
    top: '5%',
    left: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  fallbackIcon: {
    fontSize: 50,
  },
  label: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  labelText: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
  },
});