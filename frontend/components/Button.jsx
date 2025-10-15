import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSizes, ComponentHeights, BorderRadius } from '../constants/dimensions';

export default function Button({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary',
  disabled = false 
}) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.lg,
    height: ComponentHeights.button,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  primary: {
    backgroundColor: Colors.button.primary,
  },
  secondary: {
    backgroundColor: Colors.button.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.button.secondary,
  },
  disabled: {
    backgroundColor: Colors.input.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  primaryText: {
    color: Colors.text.primary,
  },
  secondaryText: {
    color: Colors.text.white,
  },
  outlineText: {
    color: Colors.button.secondary,
  },
  disabledText: {
    color: Colors.text.light,
  },
});
