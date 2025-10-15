#!/bin/bash

# Script para iniciar el desarrollo de Conectando Corazones
echo "🚀 Iniciando Conectando Corazones..."
echo "📱 Aplicación compatible con Android e iPhone"
echo ""

# Verificar si el puerto 8081 está en uso
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Puerto 8081 en uso, usando puerto 8082..."
    PORT=8082
else
    PORT=8081
fi

# Limpiar caché y iniciar
echo "🧹 Limpiando caché e iniciando servidor..."
npx expo start --clear --port $PORT

echo ""
echo "✅ Proyecto iniciado correctamente!"
echo "📱 Escanea el código QR con Expo Go en tu dispositivo"
echo "🌐 O presiona 'w' para abrir en el navegador"
