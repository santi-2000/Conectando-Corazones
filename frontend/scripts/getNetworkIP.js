const os = require('os');

/**
 * Obtiene la IP de la red local automáticamente
 */
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Saltar interfaces internas y no IPv4
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        continue;
      }
      
      // Buscar IP que no sea 127.0.0.1 (localhost)
      if (iface.address !== '127.0.0.1') {
        return iface.address;
      }
    }
  }
  
  return 'localhost'; // Fallback
}

module.exports = { getNetworkIP };
