-- =====================================================
-- CONECTANDO CORAZONES - BASE DE DATOS FINAL CONSOLIDADA
-- =====================================================
-- Script unificado basado en la base de datos original
-- Incluye solo las tablas necesarias para la aplicación actual
-- Compatible con TiDB y MySQL

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS conectando_corazones 
CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE conectando_corazones;

-- =====================================================
-- 1. TABLAS DE USUARIOS Y AUTENTICACIÓN (ACTUALIZADAS)
-- =====================================================

-- Tabla de roles del sistema
CREATE TABLE IF NOT EXISTS roles (
  id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(40) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  permisos JSON,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal de usuarios (actualizada con username)
CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  rol_id TINYINT UNSIGNED NOT NULL DEFAULT 2,
  nombre VARCHAR(80) NOT NULL,
  apellidos VARCHAR(120),
  telefono VARCHAR(20),
  email VARCHAR(160),
  email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  fecha_nacimiento DATE,
  sexo ENUM('F','M','X') DEFAULT 'F',
  direccion VARCHAR(255),
  municipio VARCHAR(80),
  estado_geografico VARCHAR(80),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_user_id (user_id),
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_rol (rol_id),
  INDEX idx_activo (activo),
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Tabla de credenciales de usuario (contraseñas)
CREATE TABLE IF NOT EXISTS user_credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES usuarios(user_id) ON DELETE CASCADE
);

-- =====================================================
-- 2. TABLAS DE BIBLIOTECA EDUCATIVA
-- =====================================================

-- Tabla de categorías de biblioteca
CREATE TABLE IF NOT EXISTS biblioteca_categoria (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  color VARCHAR(7) DEFAULT '#4A90E2',
  icono VARCHAR(50),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items de biblioteca (libros educativos)
CREATE TABLE IF NOT EXISTS biblioteca_item (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  categoria_id INT UNSIGNED,
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(255) NOT NULL,
  editorial VARCHAR(255),
  isbn VARCHAR(20),
  nivel_educativo ENUM('primaria', 'secundaria', 'preparatoria', 'universidad') NOT NULL,
  grado VARCHAR(50),
  materia VARCHAR(100),
  descripcion TEXT,
  portada_url VARCHAR(500),
  archivo_url VARCHAR(500),
  paginas INT,
  idioma VARCHAR(50) DEFAULT 'español',
  fecha_publicacion DATE,
  tags JSON,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_categoria (categoria_id),
  INDEX idx_nivel (nivel_educativo),
  INDEX idx_grado (grado),
  INDEX idx_materia (materia),
  INDEX idx_activo (activo),
  FOREIGN KEY (categoria_id) REFERENCES biblioteca_categoria(id) ON DELETE SET NULL
);

-- =====================================================
-- 3. TABLAS DE DIRECTORIO DE APOYOS
-- =====================================================

-- Tabla de categorías de apoyos
CREATE TABLE IF NOT EXISTS apoyo_categoria (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  icono VARCHAR(50),
  color VARCHAR(7) DEFAULT '#4A90E2',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de apoyos/directorio
CREATE TABLE IF NOT EXISTS apoyos (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  categoria_id INT UNSIGNED,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(255),
  direccion TEXT,
  sitio_web VARCHAR(500),
  horarios TEXT,
  servicios JSON,
  requisitos TEXT,
  costo VARCHAR(100),
  contacto_responsable VARCHAR(255),
  notas_adicionales TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_categoria (categoria_id),
  INDEX idx_activo (activo),
  INDEX idx_telefono (telefono),
  INDEX idx_email (email),
  FOREIGN KEY (categoria_id) REFERENCES apoyo_categoria(id) ON DELETE SET NULL
);

-- =====================================================
-- 4. TABLAS DE DIARIO Y MOMS WEEK
-- =====================================================

-- Tabla de entradas del diario
CREATE TABLE IF NOT EXISTS diario (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  fecha DATE NOT NULL,
  titulo VARCHAR(255),
  contenido TEXT,
  fotos JSON,
  emociones JSON,
  tags JSON,
  estado_animo ENUM('muy_feliz', 'feliz', 'neutral', 'triste', 'muy_triste'),
  actividad_principal VARCHAR(255),
  notas_privadas TEXT,
  estado ENUM('borrador', 'completado') DEFAULT 'completado',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY unique_user_date (usuario_id, fecha),
  INDEX idx_usuario_fecha (usuario_id, fecha),
  INDEX idx_estado (estado),
  INDEX idx_estado_animo (estado_animo),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de cartas semanales (Moms Week)
CREATE TABLE IF NOT EXISTS carta_semanal (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  semana_numero INT NOT NULL,
  año INT NOT NULL,
  fecha_entrada DATE NOT NULL,
  dia_semana ENUM('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo') NOT NULL,
  titulo VARCHAR(255),
  descripcion TEXT,
  fotos JSON,
  emociones JSON,
  tags JSON,
  actividad_especial VARCHAR(255),
  notas_personales TEXT,
  estado ENUM('borrador', 'completado') DEFAULT 'completado',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_usuario_semana (usuario_id, semana_numero, año),
  INDEX idx_fecha (fecha_entrada),
  INDEX idx_dia (dia_semana),
  INDEX idx_estado (estado),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de PDFs generados
CREATE TABLE IF NOT EXISTS pdf_generados (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  ruta_archivo VARCHAR(500) NOT NULL,
  url_publica VARCHAR(500),
  tipo_pdf ENUM('diario_semanal', 'diario_mensual', 'memoria_anual') NOT NULL,
  semana_numero INT,
  año INT,
  fecha_inicio DATE,
  fecha_fin DATE,
  tamaño_archivo BIGINT,
  estado ENUM('generando', 'generado', 'error') DEFAULT 'generado',
  fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_usuario (usuario_id),
  INDEX idx_tipo (tipo_pdf),
  INDEX idx_semana (semana_numero, año),
  INDEX idx_estado (estado),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =====================================================
-- 5. TABLAS DE CALENDARIO Y EVENTOS
-- =====================================================

-- Tabla de eventos del calendario
CREATE TABLE IF NOT EXISTS eventos (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME,
  todo_el_dia BOOLEAN DEFAULT FALSE,
  tipo_evento ENUM('personal', 'trabajo', 'familia', 'salud', 'educacion', 'otro') DEFAULT 'personal',
  color VARCHAR(7) DEFAULT '#4A90E2',
  ubicacion VARCHAR(255),
  recordatorio_minutos INT,
  importancia ENUM('baja', 'media', 'alta') DEFAULT 'media',
  estado ENUM('activo', 'completado', 'cancelado') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_usuario (usuario_id),
  INDEX idx_fecha_inicio (fecha_inicio),
  INDEX idx_tipo (tipo_evento),
  INDEX idx_estado (estado),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =====================================================
-- 6. TABLAS DE FAFORE
-- =====================================================

-- Tabla de información de FAFORE
CREATE TABLE IF NOT EXISTS fafore_info (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  subtitulo VARCHAR(255),
  logo_url VARCHAR(500),
  mision TEXT,
  vision TEXT,
  valores JSON,
  contacto JSON,
  servicios JSON,
  horarios JSON,
  informacion_legal JSON,
  redes_sociales JSON,
  colores JSON,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. TABLAS DE AUDITORÍA Y MÉTRICAS
-- =====================================================

-- Tabla de métricas de eventos
CREATE TABLE IF NOT EXISTS metricas_event (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED,
  evento_tipo VARCHAR(100) NOT NULL,
  evento_datos JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_usuario (usuario_id),
  INDEX idx_evento (evento_tipo),
  INDEX idx_fecha (created_at),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de historial de llamadas
CREATE TABLE IF NOT EXISTS historial_llamadas (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED,
  apoyo_id BIGINT UNSIGNED,
  telefono VARCHAR(20) NOT NULL,
  fecha_llamada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duracion_segundos INT,
  resultado ENUM('exitoso', 'no_contesto', 'ocupado', 'error') DEFAULT 'exitoso',
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_usuario (usuario_id),
  INDEX idx_apoyo (apoyo_id),
  INDEX idx_fecha (fecha_llamada),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (apoyo_id) REFERENCES apoyos(id) ON DELETE SET NULL
);

-- =====================================================
-- 8. INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar roles básicos
INSERT INTO roles (id, nombre, descripcion, permisos) VALUES
(1, 'ADMIN', 'Administrador del sistema - acceso completo incluyendo estadísticas', '{"all": true, "estadisticas": true}'),
(2, 'USUARIO', 'Usuario normal - acceso a todas las funcionalidades excepto estadísticas', '{"diario": true, "calendario": true, "biblioteca": true, "directorio": true, "eventos": true}');

-- Insertar categorías de biblioteca
INSERT INTO biblioteca_categoria (nombre, descripcion, color, icono) VALUES
('Matemáticas', 'Libros de matemáticas para todos los niveles', '#FF6B6B', '📐'),
('Ciencias', 'Libros de ciencias naturales y experimentales', '#4ECDC4', '🔬'),
('Español', 'Libros de lengua y literatura', '#45B7D1', '📚'),
('Historia', 'Libros de historia y geografía', '#96CEB4', '🏛️'),
('Inglés', 'Libros de idioma inglés', '#FFEAA7', '🇺🇸'),
('Arte', 'Libros de arte y creatividad', '#DDA0DD', '🎨'),
('Deportes', 'Libros de educación física y deportes', '#98D8C8', '⚽'),
('Valores', 'Libros de valores y ética', '#F7DC6F', '❤️');

-- Insertar categorías de apoyos
INSERT INTO apoyo_categoria (nombre, descripcion, icono, color) VALUES
('Alimentación', 'Apoyos relacionados con alimentación y nutrición', '🍎', '#FF6B6B'),
('Salud', 'Servicios de salud y bienestar', '🏥', '#4ECDC4'),
('Psicología', 'Apoyos psicológicos y emocionales', '🧠', '#45B7D1'),
('Comunitario-Legal', 'Apoyos comunitarios y legales', '⚖️', '#96CEB4'),
('Educación', 'Apoyos educativos y formativos', '📚', '#FFEAA7'),
('Vivienda', 'Apoyos para vivienda y hogar', '🏠', '#DDA0DD'),
('Trabajo', 'Apoyos laborales y empleo', '💼', '#98D8C8'),
('Transporte', 'Apoyos de transporte y movilidad', '🚌', '#F7DC6F');

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (
    user_id, username, rol_id, nombre, apellidos, email, password_hash, activo
) VALUES
('user123', 'sofia_garcia', 2, 'Sofia', 'García', 'sofia.garcia@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE),
('admin001', 'maria_admin', 1, 'María', 'Administradora', 'admin@conectando-corazones.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE),
('user456', 'carlos_rodriguez', 2, 'Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE),
('user789', 'ana_lopez', 2, 'Ana', 'López', 'ana.lopez@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- Insertar credenciales de ejemplo
INSERT INTO user_credentials (user_id, password_hash, salt) VALUES
('user123', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'salt123'),
('admin001', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'salt123'),
('user456', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'salt123'),
('user789', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'salt123');

-- Insertar información de FAFORE
INSERT INTO fafore_info (
    nombre, subtitulo, logo_url, mision, vision, valores, contacto, servicios, 
    horarios, informacion_legal, redes_sociales, colores
) VALUES (
    'FAFORE',
    'Familia, Fortaleza Y Reinserción A.C.',
    '/assets/images/logo-fafore.png',
    'Generar una relación humana digna entre la sociedad y las personas privadas de la libertad (PPL) y sus familias, contribuyendo a su reeducación, reinserción y restitución de derechos.',
    'Ser una organización fortalecida, sostenible y con capacidad de incidencia, que deje cimientos duraderos para continuar brindando acompañamiento integral a las mujeres PPL y sus familias, canalizándolas hacia oportunidades educativas, laborales, médicas y sociales para reconstituir sus vidas con dignidad.',
    JSON_ARRAY(
        'Empatía', 'Conciencia', 'Familia', 'Fortaleza', 'Reinserción',
        'Inclusión', 'Segunda Oportunidad', 'Compromiso', 'Trato Personalista'
    ),
    JSON_OBJECT(
        'telefono', '142 58 18',
        'email', 'faforeac@gmail.com',
        'sitio_web', NULL,
        'direccion', 'Calle Lázaro de Baigorri 607, Col. San Felipe'
    ),
    JSON_ARRAY(
        JSON_OBJECT('icono', '👨‍👩‍👧‍👦', 'nombre', 'Apoyo Familiar'),
        JSON_OBJECT('icono', '📚', 'nombre', 'Educación'),
        JSON_OBJECT('icono', '🏥', 'nombre', 'Salud'),
        JSON_OBJECT('icono', '⚖️', 'nombre', 'Asesoría Legal'),
        JSON_OBJECT('icono', '🤝', 'nombre', 'Reinserción Social'),
        JSON_OBJECT('icono', '💼', 'nombre', 'Desarrollo Laboral')
    ),
    JSON_OBJECT(
        'lunes_viernes', '9:00 AM - 6:00 PM',
        'sabados', '9:00 AM - 2:00 PM',
        'domingos', 'Cerrado'
    ),
    JSON_OBJECT(
        'rfc', 'FAF123456789',
        'fecha_constitucion', '15 de Marzo, 2020',
        'clave_registro', 'FAF-2020-001'
    ),
    JSON_OBJECT(
        'facebook', 'https://www.facebook.com/profile.php?id=100087547196288&locale=es_LA',
        'instagram', 'fafore_ac',
        'twitter', NULL,
        'linkedin', NULL
    ),
    JSON_OBJECT(
        'primario', '#4A90E2',
        'secundario', '#FF6B9D',
        'accento', '#50C878'
    )
);

-- =====================================================
-- SCRIPT CONSOLIDADO COMPLETADO
-- =====================================================
-- Este script incluye solo las tablas necesarias para la aplicación actual
-- Basado en la estructura original pero actualizada con las mejoras implementadas
