const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuración para desarrollo local
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;