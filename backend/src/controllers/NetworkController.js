const os = require('os');

/**
 * Controlador para información de red
 */
class NetworkController {
  /**
   * Obtener información de red del servidor
   */
  async getNetworkInfo(req, res) {
    try {
      const interfaces = os.networkInterfaces();
      let serverIP = 'localhost';

      // Buscar la IP de la red local
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
          // Saltar interfaces internas y no IPv4
          if (iface.family !== 'IPv4' || iface.internal !== false) {
            continue;
          }
          
          // Buscar IP que no sea 127.0.0.1 (localhost)
          if (iface.address !== '127.0.0.1') {
            serverIP = iface.address;
            break;
          }
        }
        if (serverIP !== 'localhost') break;
      }

      res.json({
        success: true,
        data: {
          ip: serverIP,
          port: process.env.PORT || 3000,
          interfaces: Object.keys(interfaces),
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error en getNetworkInfo:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener información de red',
        message: error.message
      });
    }
  }

  /**
   * Health check con información de red
   */
  async healthCheck(req, res) {
    try {
      const interfaces = os.networkInterfaces();
      const networkIPs = [];

      // Obtener todas las IPs de red
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
          if (iface.family === 'IPv4' && !iface.internal) {
            networkIPs.push({
              interface: name,
              ip: iface.address,
              netmask: iface.netmask
            });
          }
        }
      }

      res.json({
        success: true,
        status: 'OK',
        data: {
          server: 'Conectando Corazones API',
          version: '1.0.0',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          network: {
            localhost: 'http://localhost:3000',
            networkIPs: networkIPs.map(net => `http://${net.ip}:3000`),
            allIPs: networkIPs
          },
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error en healthCheck:', error);
      res.status(500).json({
        success: false,
        error: 'Error en health check',
        message: error.message
      });
    }
  }
}

module.exports = new NetworkController();
