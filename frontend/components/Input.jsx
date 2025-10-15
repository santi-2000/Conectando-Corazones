import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSizes, ComponentHeights, BorderRadius } from '../constants/dimensions';

export default function Input({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  style,
  label,
  error,
  ...props 
}) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style
        ]}
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.input.background,
    borderRadius: BorderRadius.lg,
    height: ComponentHeights.input,
    paddingHorizontal: 20,
    fontSize: FontSizes.sm,
    borderWidth: 1,
    borderColor: Colors.input.border,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputError: {
    borderColor: Colors.input.borderError,
  },
  errorText: {
    color: Colors.input.borderError,
    fontSize: FontSizes.xs,
    marginTop: 5,
  },
});
