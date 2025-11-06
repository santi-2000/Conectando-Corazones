const { query } = require('../../config/database');

/**
 * Obtener información de la base de datos
 */
async function getDatabaseInfo() {
  try {
    // Probar conexión básica
    const connectionTest = await query('SELECT 1 as test');
    
    // Obtener información de la base de datos
    const dbVersion = await query('SELECT VERSION() as version');
    const dbName = await query('SELECT DATABASE() as database_name');
    const dbUser = await query('SELECT USER() as user');
    
    // Contar registros en tablas principales (con manejo de errores si no existen)
    const tableCounts = {};
    const tablesToCheck = [
      'educational_books',
      'support_directories', 
      'users',
      'usuarios',
      'moms_week_entries',
      'diary_entries',
      'calendar_events'
    ];
    
    for (const tableName of tablesToCheck) {
      try {
        const result = await query(`SELECT COUNT(*) as count FROM ${tableName}`);
        tableCounts[tableName] = result[0]?.count || 0;
      } catch (error) {
        // Si la tabla no existe, simplemente marcarla como 0
        tableCounts[tableName] = 'No existe';
      }
    }

    return {
      connected: true,
      version: dbVersion[0]?.version,
      database: dbName[0]?.database_name,
      user: dbUser[0]?.user,
      tables: tableCounts
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
}

/**
 * Controlador para diagnósticos del sistema
 */
class DiagnosticController {
  /**
   * Diagnóstico completo del sistema
   */
  async getSystemDiagnostic(req, res) {
    try {
      // Información de la base de datos
      const dbInfo = await getDatabaseInfo();
      
      // Información del servidor
      const serverInfo = {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        env: process.env.NODE_ENV,
        port: process.env.PORT || 3000
      };

      // Información de la base de datos desde variables de entorno
      const dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        isTiDB: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com'),
        sslEnabled: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com')
      };

      res.json({
        success: true,
        data: {
          timestamp: new Date().toISOString(),
          server: serverInfo,
          database: {
            config: dbConfig,
            connection: dbInfo
          },
          status: 'OK'
        }
      });
    } catch (error) {
      console.error('Error en getSystemDiagnostic:', error);
      res.status(500).json({
        success: false,
        error: 'Error en diagnóstico del sistema',
        message: error.message
      });
    }
  }


  /**
   * Verificar conectividad de red
   */
  async getNetworkDiagnostic(req, res) {
    try {
      const os = require('os');
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
        data: {
          timestamp: new Date().toISOString(),
          network: {
            localhost: 'http://localhost:3000',
            networkIPs: networkIPs.map(net => `http://${net.ip}:3000`),
            allIPs: networkIPs
          },
          cors: {
            allowedOrigins: [
              'http://localhost:3000',
              'http://localhost:8081',
              'http://localhost:8082',
              ...networkIPs.map(net => `http://${net.ip}:3000`),
              ...networkIPs.map(net => `http://${net.ip}:8081`),
              ...networkIPs.map(net => `http://${net.ip}:8082`)
            ]
          }
        }
      });
    } catch (error) {
      console.error('Error en getNetworkDiagnostic:', error);
      res.status(500).json({
        success: false,
        error: 'Error en diagnóstico de red',
        message: error.message
      });
    }
  }
}

module.exports = new DiagnosticController();
