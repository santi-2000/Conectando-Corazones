
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// MIDDLEWARE BÁSICO
// =============================================

// Seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-dominio.com'] 
    : ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true
}));

// Compresión
app.use(compression());

// Servir archivos estáticos (PDFs)
app.use('/pdfs', express.static('public/pdfs'));

// Logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // límite de requests
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================
// RUTAS
// =============================================

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Conectando Corazones API funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Conectando Corazones',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      docs: '/api/docs'
    }
  });
});

// Importar módulos
const SupportDirectoryModule = require('./src/modules/SupportDirectoryModule');
const EducationalBookModule = require('./src/modules/EducationalBookModule');
const ChildrenReadingsModule = require('./src/modules/ChildrenReadingsModule');
const MomsWeekModule = require('./src/modules/MomsWeekModule');
const DiaryModule = require('./src/modules/DiaryModule');
const CalendarModule = require('./src/modules/CalendarModule');

// Crear instancias de módulos
const supportDirectoryModule = new SupportDirectoryModule();
const educationalBookModule = new EducationalBookModule();
const childrenReadingsModule = new ChildrenReadingsModule();
const momsWeekModule = new MomsWeekModule();
const diaryModule = new DiaryModule();
const calendarModule = new CalendarModule();

// Importar rutas de la API (rutas originales)
// app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/users', require('./routes/users'));
// app.use('/api/v1/diary', require('./routes/diary'));
// app.use('/api/v1/calendar', require('./routes/calendar'));
// app.use('/api/v1/library', require('./routes/library'));
// app.use('/api/v1/directory', require('./routes/directory'));
// app.use('/api/v1/notifications', require('./routes/notifications'));
// app.use('/api/v1/admin', require('./routes/admin'));

// Usar módulos nuevos
app.use('/api/v1', supportDirectoryModule.getRouter());
app.use('/api/v1', educationalBookModule.getRouter());
app.use('/api/v1', childrenReadingsModule.getRouter());
app.use('/api/v1', momsWeekModule.getRouter());
app.use('/api/v1', diaryModule.getRouter());
app.use('/api/v1', calendarModule.getRouter());


// 404 - Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    timestamp: new Date().toISOString()
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =============================================
// INICIAR SERVIDOR
// =============================================

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`📱 API disponible en: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Documentación: http://localhost:${PORT}/api/docs`);
});

module.exports = app;
