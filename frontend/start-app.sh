#!/bin/bash

# Script mejorado para iniciar Conectando Corazones
echo "🚀 Iniciando Conectando Corazones..."
echo "📱 Aplicación compatible con Android e iPhone"
echo ""

# Función para encontrar un puerto disponible
find_available_port() {
    local port=8081
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do
        port=$((port + 1))
    done
    echo $port
}

# Encontrar puerto disponible
PORT=$(find_available_port)
echo "🔌 Usando puerto: $PORT"

# Limpiar caché y iniciar
echo "🧹 Limpiando caché e iniciando servidor..."
npx expo start --clear --port $PORT

echo ""
echo "✅ Proyecto iniciado correctamente!"
echo "📱 Escanea el código QR con Expo Go en tu dispositivo"
echo "🌐 O presiona 'w' para abrir en el navegador"
