-- =============================================
-- CONECTANDO CORAZONES - BASE DE DATOS CORREGIDA
-- Compatible con TiDB y MySQL
-- Orden correcto: Tablas primero, Vistas al final
-- =============================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS conectando_corazones 
CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE conectando_corazones;

-- =============================================
-- TABLAS DE USUARIOS Y ROLES
-- =============================================

-- Tabla de roles del sistema (simplificada)
CREATE TABLE roles (
  id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(40) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  permisos JSON,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles básicos (solo ADMIN y USUARIO)
INSERT INTO roles (id, nombre, descripcion, permisos) VALUES
(1, 'ADMIN', 'Administrador del sistema - acceso completo incluyendo estadísticas', '{"all": true, "estadisticas": true}'),
(2, 'USUARIO', 'Usuario normal - acceso a todas las funcionalidades excepto estadísticas', '{"diario": true, "calendario": true, "biblioteca": true, "directorio": true, "eventos": true}');

-- Tabla principal de usuarios (simplificada)
CREATE TABLE usuarios (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  rol_id TINYINT UNSIGNED NOT NULL DEFAULT 2, -- Por defecto USUARIO
  nombre VARCHAR(80) NOT NULL,
  apellidos VARCHAR(120),
  telefono VARCHAR(20),
  email VARCHAR(160),
  email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  
  -- Información personal adicional
  fecha_nacimiento DATE,
  sexo ENUM('F','M','X') DEFAULT 'F',
  direccion VARCHAR(255),
  municipio VARCHAR(80),
  estado_geografico VARCHAR(80),
  
  -- Información educativa (para niños)
  escuela VARCHAR(160),
  grado_escolar VARCHAR(40),
  nivel_educativo ENUM('preescolar','primaria','secundaria','preparatoria') DEFAULT 'primaria',
  
  -- Información familiar (para tutores)
  parentesco ENUM('madre','padre','abuela','abuelo','tia','tio','hermana','hermano','otro') DEFAULT 'madre',
  estado_civil ENUM('soltera','casada','divorciada','viuda','union_libre') DEFAULT 'soltera',
  ocupacion VARCHAR(100),
  
  estado ENUM('activo','suspendido','eliminado') NOT NULL DEFAULT 'activo',
  ultimo_acceso TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_usuarios_email (email),
  UNIQUE KEY uk_usuarios_tel (telefono),
  KEY idx_usuarios_rol_estado (rol_id, estado),
  KEY idx_usuarios_ultimo_acceso (ultimo_acceso),
  KEY idx_usuarios_municipio (municipio),
  KEY idx_usuarios_nivel_educativo (nivel_educativo),
  
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Tabla de consentimientos (simplificada)
CREATE TABLE consentimientos (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  tipo ENUM('uso_app','envio_diario_al_penal','analitica_anonima','compartir_datos') NOT NULL,
  otorgado BOOLEAN NOT NULL,
  firmado_por VARCHAR(160) NOT NULL,
  firmado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  evidencia_url VARCHAR(255),
  version_consentimiento VARCHAR(20) DEFAULT '1.0',
  
  UNIQUE KEY uk_consent (usuario_id, tipo),
  KEY idx_consent_tipo (tipo),
  KEY idx_consent_fecha (firmado_en),
  
  CONSTRAINT fk_consent_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Usuario administrador por defecto
INSERT INTO usuarios (rol_id, nombre, apellidos, email, password_hash, email_verificado, parentesco) VALUES
(1, 'Admin', 'Sistema', 'admin@conectandocorazones.mx', '$2b$10$reemplazaConHashBcryptReal', TRUE, 'otro');

-- =============================================
-- TABLAS DE PENALES Y PPL
-- =============================================

-- Tabla de penales
CREATE TABLE penales (
  id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(160) NOT NULL,
  tipo ENUM('CERESO','CP','Otro') NOT NULL DEFAULT 'CERESO',
  direccion VARCHAR(255),
  municipio VARCHAR(80),
  estado VARCHAR(80),
  telefono VARCHAR(30),
  email VARCHAR(160),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  KEY idx_penales_municipio (municipio),
  KEY idx_penales_tipo (tipo),
  KEY idx_penales_activo (activo)
);

-- Insertar penales de ejemplo
INSERT INTO penales (nombre, tipo, direccion, municipio, estado, telefono, email) VALUES
('CERESO Femenil Chihuahua', 'CERESO', 'Carretera a Aldama Km 5', 'Chihuahua', 'Chihuahua', '614-123-4567', 'cereso.femenil@chihuahua.gob.mx');

-- Tabla de personas privadas de libertad (PPL)
CREATE TABLE ppl (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  apellidos VARCHAR(120),
  folio_expediente VARCHAR(60),
  penal_id SMALLINT UNSIGNED NOT NULL,
  sexo ENUM('F','M','X') NOT NULL DEFAULT 'F',
  fecha_ingreso DATE,
  fecha_salida_estimada DATE,
  estado ENUM('activa','liberada','trasladada') DEFAULT 'activa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  KEY idx_ppl_penal (penal_id),
  KEY idx_ppl_estado (estado),
  KEY idx_ppl_folio (folio_expediente),
  
  CONSTRAINT fk_ppl_penal FOREIGN KEY (penal_id) REFERENCES penales(id)
);

-- Tabla de relaciones PPL-Usuario
CREATE TABLE relacion_ppl_usuario (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  ppl_id BIGINT UNSIGNED NOT NULL,
  usuario_id BIGINT UNSIGNED NOT NULL,
  tipo_relacion ENUM('madre','hermana','tia','abuela','otra') NOT NULL DEFAULT 'madre',
  vigente BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_inicio DATE,
  fecha_fin DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_rel (ppl_id, usuario_id),
  KEY idx_rel_vigente (vigente),
  KEY idx_rel_tipo (tipo_relacion),
  
  CONSTRAINT fk_rel_ppl FOREIGN KEY (ppl_id) REFERENCES ppl(id) ON DELETE CASCADE,
  CONSTRAINT fk_rel_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- SISTEMA DE DIARIO EMOCIONAL
-- =============================================

-- Tabla principal del diario
CREATE TABLE diario (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  fecha DATE NOT NULL,
  texto MEDIUMTEXT,
  emocion ENUM('feliz','triste','orgulloso','enojado','asustado','agradecido','tranquilo','emocionado','otro') DEFAULT 'feliz',
  estado ENUM('borrador','enviado_revision','aprobado','rechazado') NOT NULL DEFAULT 'borrador',
  semana_iso_year SMALLINT,
  semana_num TINYINT UNSIGNED,
  palabras_count INT UNSIGNED DEFAULT 0,
  tiempo_escritura INT UNSIGNED DEFAULT 0, -- en segundos
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_diario_dia (usuario_id, fecha),
  KEY idx_diario_semana (usuario_id, semana_iso_year, semana_num),
  KEY idx_diario_estado (estado),
  KEY idx_diario_emocion (emocion),
  KEY idx_diario_fecha (fecha),
  
  CONSTRAINT fk_diario_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de cartas semanales
CREATE TABLE carta_semanal (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  fecha_referencia DATE,
  semana_iso_year SMALLINT,
  semana_num_iso TINYINT UNSIGNED,
  pdf_url VARCHAR(255),
  estado ENUM('generada','enviada_revision','aprobada','rechazada','enviada_penal') NOT NULL DEFAULT 'generada',
  fecha_envio_penal TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_carta (usuario_id, semana_iso_year, semana_num_iso),
  KEY idx_carta_estado (estado),
  KEY idx_carta_semana (semana_iso_year, semana_num_iso),
  
  CONSTRAINT fk_carta_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de archivos PDF generados
CREATE TABLE pdf_generados (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  carta_semanal_id BIGINT UNSIGNED,
  tipo ENUM('carta_semanal','diario_completo','reporte_personalizado') NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  ruta_archivo VARCHAR(500) NOT NULL,
  tamaño_bytes BIGINT UNSIGNED,
  fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_descarga TIMESTAMP NULL,
  descargas_count INT UNSIGNED DEFAULT 0,
  estado ENUM('generado','descargado','eliminado') DEFAULT 'generado',
  
  KEY idx_pdf_usuario (usuario_id),
  KEY idx_pdf_tipo (tipo),
  KEY idx_pdf_fecha (fecha_generacion),
  KEY idx_pdf_estado (estado),
  
  CONSTRAINT fk_pdf_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_pdf_carta FOREIGN KEY (carta_semanal_id) REFERENCES carta_semanal(id) ON DELETE SET NULL
);

-- =============================================
-- BIBLIOTECA ESCOLAR
-- =============================================

-- Categorías de biblioteca
CREATE TABLE biblioteca_categoria (
  id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  descripcion TEXT,
  icono VARCHAR(50),
  color VARCHAR(7),
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 100,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorías de biblioteca
INSERT INTO biblioteca_categoria (id, nombre, descripcion, icono, color, orden) VALUES
(1, 'Educativo', 'Libros y materiales educativos', '📚', '#4A90E2', 10),
(2, 'Infantil', 'Cuentos y libros para niños', '📖', '#FF6B9D', 20),
(3, 'Ciencias', 'Materiales de ciencias naturales', '🔬', '#50C878', 30),
(4, 'Matemáticas', 'Libros y ejercicios de matemáticas', '🔢', '#FFD700', 40);

-- Items de biblioteca
CREATE TABLE biblioteca_item (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  categoria_id SMALLINT UNSIGNED NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  autor VARCHAR(160),
  tipo ENUM('libro','pdf','enlace','video','audio','actividad','libro_digital') NOT NULL,
  categoria VARCHAR(80),
  descripcion TEXT,
  url_recurso VARCHAR(255) NOT NULL,
  nivel_educativo ENUM('preescolar','primaria','secundaria','preparatoria','todos') DEFAULT 'todos',
  edad_recomendada VARCHAR(20),
  idioma VARCHAR(5) DEFAULT 'es',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  visualizaciones INT UNSIGNED DEFAULT 0,
  created_by BIGINT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  KEY idx_biblio_cat (categoria_id, activo),
  KEY idx_biblio_nivel (nivel_educativo),
  KEY idx_biblio_tipo (tipo),
  KEY idx_biblio_activo (activo),
  
  CONSTRAINT fk_biblio_cat FOREIGN KEY (categoria_id) REFERENCES biblioteca_categoria(id),
  CONSTRAINT fk_biblio_user FOREIGN KEY (created_by) REFERENCES usuarios(id)
);

-- =============================================
-- DIRECTORIO DE APOYOS
-- =============================================

-- Categorías de apoyos
CREATE TABLE apoyo_categoria (
  id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  descripcion TEXT,
  icono VARCHAR(50),
  color VARCHAR(7),
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 100,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorías de apoyos
INSERT INTO apoyo_categoria (id, nombre, descripcion, icono, color, orden) VALUES
(1, 'Salud', 'Servicios de salud y bienestar', '🏥', '#FF6B9D', 10),
(2, 'Alimentación', 'Apoyo alimentario y nutricional', '🍎', '#FFD700', 20),
(3, 'Legal', 'Asesoría legal y jurídica', '⚖️', '#4A90E2', 30),
(4, 'Psicología', 'Atención psicológica y mental', '🧠', '#50C878', 40);

-- Tabla de apoyos
CREATE TABLE apoyos (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  categoria_id SMALLINT UNSIGNED NOT NULL,
  nombre VARCHAR(160) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  descripcion TEXT,
  telefono VARCHAR(30),
  email VARCHAR(160),
  direccion VARCHAR(255),
  horario_atencion VARCHAR(160),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  KEY idx_apoyo_cat (categoria_id, activo),
  KEY idx_apoyo_nombre (nombre),
  KEY idx_apoyo_activo (activo),
  
  CONSTRAINT fk_apoyo_cat FOREIGN KEY (categoria_id) REFERENCES apoyo_categoria(id)
);

-- =============================================
-- CALENDARIO Y EVENTOS
-- =============================================

-- Tabla de eventos
CREATE TABLE eventos (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  tipo ENUM('visita_penal','tramite','evento_comunitario','recordatorio_personal','evento_familiar','evento_deportivo','cita_medica','reunion_escolar','evento_diferente') NOT NULL,
  titulo VARCHAR(160) NOT NULL,
  descripcion TEXT,
  inicio DATETIME NOT NULL,
  fin DATETIME,
  all_day BOOLEAN NOT NULL DEFAULT FALSE,
  creador_id BIGINT UNSIGNED NOT NULL,
  penal_id SMALLINT UNSIGNED,
  rrule VARCHAR(255), -- regla de recurrencia
  ubicacion VARCHAR(200),
  color VARCHAR(7) DEFAULT '#4A90E2',
  recordatorio_minutos INT UNSIGNED DEFAULT 15,
  estado ENUM('activo','completado','cancelado') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  KEY idx_eventos_tipo_fecha (tipo, inicio),
  KEY idx_eventos_creador (creador_id),
  KEY idx_eventos_penal (penal_id),
  KEY idx_eventos_estado (estado),
  KEY idx_eventos_inicio (inicio),
  
  CONSTRAINT fk_eventos_user FOREIGN KEY (creador_id) REFERENCES usuarios(id),
  CONSTRAINT fk_eventos_penal FOREIGN KEY (penal_id) REFERENCES penales(id)
);

-- =============================================
-- SISTEMA DE NOTIFICACIONES
-- =============================================

-- Tabla de tokens de dispositivos para notificaciones push
CREATE TABLE dispositivo_tokens (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  token VARCHAR(500) NOT NULL,
  plataforma ENUM('ios','android','web') NOT NULL,
  version_app VARCHAR(20),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_token (token),
  KEY idx_usuario_activo (usuario_id, activo),
  KEY idx_plataforma (plataforma),
  
  CONSTRAINT fk_tokens_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de notificaciones
CREATE TABLE notificaciones (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  tipo ENUM('recordatorio','evento','sistema','promocional','emergencia') NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  datos_extra JSON,
  enviada BOOLEAN NOT NULL DEFAULT FALSE,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_envio TIMESTAMP NULL,
  fecha_lectura TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  KEY idx_usuario_tipo (usuario_id, tipo),
  KEY idx_enviada (enviada),
  KEY idx_leida (leida),
  KEY idx_fecha_envio (fecha_envio),
  
  CONSTRAINT fk_notif_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- SISTEMA DE ARCHIVOS MULTIMEDIA
-- =============================================

-- Tabla de archivos multimedia
CREATE TABLE archivos_multimedia (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  tipo ENUM('imagen','video','audio','documento','pdf') NOT NULL,
  nombre_original VARCHAR(255) NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  ruta_archivo VARCHAR(500) NOT NULL,
  tamaño_bytes BIGINT UNSIGNED,
  mime_type VARCHAR(100),
  hash_archivo VARCHAR(64),
  metadata JSON,
  relacion_tabla VARCHAR(50), -- tabla relacionada (diario, eventos, etc)
  relacion_id BIGINT UNSIGNED, -- ID del registro relacionado
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  KEY idx_usuario_tipo (usuario_id, tipo),
  KEY idx_relacion (relacion_tabla, relacion_id),
  KEY idx_activo (activo),
  KEY idx_hash (hash_archivo),
  
  CONSTRAINT fk_archivos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- SISTEMA DE UBICACIONES
-- =============================================

-- Tabla de ubicaciones
CREATE TABLE ubicaciones (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(200) NOT NULL,
  direccion TEXT,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  radio_metros INT UNSIGNED DEFAULT 100,
  tipo ENUM('penal','hospital','escuela','oficina','otro') NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(160),
  horario_atencion VARCHAR(255),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  KEY idx_tipo_activo (tipo, activo),
  KEY idx_coordenadas (latitud, longitud),
  KEY idx_nombre (nombre)
);

-- Tabla de visitas a ubicaciones
CREATE TABLE visitas_ubicaciones (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  ubicacion_id BIGINT UNSIGNED NOT NULL,
  fecha_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notas TEXT,
  calificacion TINYINT UNSIGNED, -- 1-5 estrellas
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  KEY idx_usuario_fecha (usuario_id, fecha_visita),
  KEY idx_ubicacion (ubicacion_id),
  KEY idx_calificacion (calificacion),
  
  CONSTRAINT fk_visitas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_visitas_ubicacion FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id) ON DELETE CASCADE
);

-- =============================================
-- SISTEMA DE HISTORIAL DE LLAMADAS
-- =============================================

-- Tabla de historial de llamadas
CREATE TABLE historial_llamadas (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  numero_telefono VARCHAR(20) NOT NULL,
  nombre_contacto VARCHAR(160),
  tipo_llamada ENUM('entrante','saliente','perdida') NOT NULL,
  duracion_segundos INT UNSIGNED DEFAULT 0,
  fecha_llamada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notas TEXT,
  relacion_tabla VARCHAR(50), -- tabla relacionada (apoyos, etc)
  relacion_id BIGINT UNSIGNED, -- ID del registro relacionado
  
  KEY idx_usuario_fecha (usuario_id, fecha_llamada),
  KEY idx_numero (numero_telefono),
  KEY idx_tipo (tipo_llamada),
  KEY idx_relacion (relacion_tabla, relacion_id),
  
  CONSTRAINT fk_llamadas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- SISTEMA DE CONFIGURACIONES
-- =============================================

-- Tabla de configuraciones de usuario
CREATE TABLE configuraciones_usuario (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  clave VARCHAR(100) NOT NULL,
  valor TEXT,
  tipo ENUM('string','number','boolean','json') NOT NULL DEFAULT 'string',
  descripcion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_usuario_clave (usuario_id, clave),
  KEY idx_clave (clave),
  
  CONSTRAINT fk_config_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- SISTEMA DE MÉTRICAS Y AUDITORÍA
-- =============================================

-- Tabla de métricas de eventos
CREATE TABLE metricas_event (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED,
  evento VARCHAR(80) NOT NULL,
  datos_adicionales JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  KEY idx_metricas_usuario (usuario_id),
  KEY idx_metricas_evento (evento),
  KEY idx_metricas_fecha (created_at),
  
  CONSTRAINT fk_metricas_user FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de auditoría
CREATE TABLE audit_log (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED,
  accion VARCHAR(80) NOT NULL,
  objeto VARCHAR(50) NOT NULL,
  objeto_id BIGINT UNSIGNED,
  datos_anteriores JSON,
  datos_nuevos JSON,
  ip VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  KEY idx_audit_usuario (usuario_id),
  KEY idx_audit_accion (accion),
  KEY idx_audit_objeto (objeto, objeto_id),
  
  CONSTRAINT fk_audit_user FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =============================================
-- INFORMACIÓN DE FAFORE
-- =============================================

-- Tabla de información de la organización FAFORE
CREATE TABLE fafore_info (
  id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(200) NOT NULL,
  subtitulo VARCHAR(255),
  mision TEXT,
  vision TEXT,
  valores JSON,
  telefono VARCHAR(40),
  email VARCHAR(160),
  website VARCHAR(255),
  direccion VARCHAR(255),
  horario_atencion VARCHAR(160),
  rfc VARCHAR(20),
  fecha_constitucion DATE,
  clave_registro VARCHAR(50),
  logo_url VARCHAR(255),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de servicios de FAFORE
CREATE TABLE fafore_servicios (
  id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  icono VARCHAR(50),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  orden SMALLINT UNSIGNED DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Datos iniciales para ubicaciones
INSERT INTO ubicaciones (nombre, direccion, latitud, longitud, tipo, telefono, email, horario_atencion) VALUES
('Hospital Infantil de Chihuahua', 'Av. Universidad 1000, Chihuahua, Chih.', 28.6329, -106.0691, 'hospital', '614-214-4000', 'info@hospitalinfantil.ch', 'Lunes a viernes, 8:00 am - 3:00 pm'),
('Centro de Salud Mental', 'Calle Libertad 456, Chihuahua, Chih.', 28.6350, -106.0700, 'hospital', '614-777-8888', 'contacto@saludmental.ch', 'Lunes a viernes, 9:00 am - 6:00 pm'),
('Banco de Alimentos', 'Av. Tecnológico 789, Chihuahua, Chih.', 28.6400, -106.0750, 'otro', '614-123-4567', 'info@bancodealimentos.ch', 'Lunes a viernes, 9:00 am - 5:00 pm'),
('Centro de Asistencia Legal', 'Calle Independencia 123, Chihuahua, Chih.', 28.6300, -106.0650, 'oficina', '614-456-7890', 'legal@asistencia.ch', 'Lunes a viernes, 9:00 am - 6:00 pm');

-- Datos iniciales para FAFORE
INSERT INTO fafore_info (nombre, subtitulo, mision, vision, valores, telefono, email, website, direccion, horario_atencion, rfc, fecha_constitucion, clave_registro) VALUES
('FAFORE', 'Familia, Fortaleza Y Reinserción A.C.',
'Trabajamos para fortalecer los lazos familiares y apoyar la reinserción social, brindando herramientas y recursos que promuevan el bienestar integral de las familias y comunidades.',
'Ser una organización líder en la promoción de la unidad familiar y la reinserción social, creando un impacto positivo y duradero en las comunidades que servimos.',
'["Solidaridad y Compromiso", "Respeto y Dignidad", "Transparencia y Honestidad", "Trabajo en Equipo", "Innovación Social"]',
'+52 55 1234 5678', 'contacto@fafore.org', 'https://www.fafore.org', 'Av. Reforma 123, CDMX',
'Lunes a Viernes: 9:00 AM - 6:00 PM, Sábados: 9:00 AM - 2:00 PM, Domingos: Cerrado',
'FAF123456789', '2020-03-15', 'FAF-2020-001');

INSERT INTO fafore_servicios (nombre, descripcion, icono, orden) VALUES
('Apoyo Familiar', 'Servicios de apoyo y fortalecimiento familiar', '👨‍👩‍👧‍👦', 10),
('Educación', 'Programas educativos y de capacitación', '📚', 20),
('Salud', 'Servicios de salud y bienestar', '🏥', 30),
('Asesoría Legal', 'Apoyo jurídico y legal', '⚖️', 40),
('Reinserción Social', 'Programas de reinserción social', '🤝', 50),
('Desarrollo Laboral', 'Capacitación y empleo', '💼', 60);

-- Configuraciones por defecto para usuarios
INSERT INTO configuraciones_usuario (usuario_id, clave, valor, tipo, descripcion) VALUES
(1, 'notificaciones_push', 'true', 'boolean', 'Recibir notificaciones push'),
(1, 'notificaciones_email', 'true', 'boolean', 'Recibir notificaciones por email'),
(1, 'tema_app', 'claro', 'string', 'Tema de la aplicación'),
(1, 'idioma', 'es', 'string', 'Idioma de la aplicación'),
(1, 'zona_horaria', 'America/Chihuahua', 'string', 'Zona horaria del usuario'),
(1, 'recordatorios_eventos', '15', 'number', 'Minutos antes de recordar eventos'),
(1, 'privacidad_perfil', 'publico', 'string', 'Nivel de privacidad del perfil');

-- =============================================
-- DATOS DE EJEMPLO PARA PRUEBAS
-- =============================================

-- Usuarios de ejemplo
INSERT INTO usuarios (rol_id, nombre, apellidos, email, password_hash, email_verificado, telefono, fecha_nacimiento, sexo, direccion, municipio, estado_geografico, escuela, grado_escolar, nivel_educativo, parentesco, estado_civil, ocupacion) VALUES
(2, 'María', 'González Pérez', 'maria.gonzalez@email.com', '$2b$10$ejemploHashBcrypt123', TRUE, '614-123-4567', '1985-03-15', 'F', 'Calle Libertad 123', 'Chihuahua', 'Chihuahua', 'Escuela Primaria Benito Juárez', '5to', 'primaria', 'madre', 'casada', 'Ama de casa'),
(2, 'Ana', 'López Martínez', 'ana.lopez@email.com', '$2b$10$ejemploHashBcrypt456', TRUE, '614-234-5678', '1990-07-22', 'F', 'Av. Universidad 456', 'Chihuahua', 'Chihuahua', 'Escuela Secundaria Técnica 1', '2do', 'secundaria', 'madre', 'soltera', 'Estudiante'),
(2, 'Carmen', 'Rodríguez Silva', 'carmen.rodriguez@email.com', '$2b$10$ejemploHashBcrypt789', TRUE, '614-345-6789', '1988-11-08', 'F', 'Calle Independencia 789', 'Chihuahua', 'Chihuahua', 'Jardín de Niños Rosario', '3er', 'preescolar', 'madre', 'union_libre', 'Trabajadora social');

-- PPL de ejemplo
INSERT INTO ppl (penal_id, nombre, apellidos, sexo, estado, folio_expediente, fecha_ingreso) VALUES
(1, 'Roberto', 'González Hernández', 'M', 'activa', 'CER-FEM-2024-001', '2023-01-15'),
(1, 'Carlos', 'López García', 'M', 'activa', 'CER-FEM-2024-002', '2023-03-20'),
(1, 'Miguel', 'Rodríguez Pérez', 'M', 'activa', 'CER-FEM-2024-003', '2023-05-10');

-- Relaciones PPL-Usuario
INSERT INTO relacion_ppl_usuario (ppl_id, usuario_id, tipo_relacion, vigente, fecha_inicio) VALUES
(1, 2, 'madre', TRUE, '2024-01-15'),
(2, 3, 'madre', TRUE, '2024-02-20'),
(3, 4, 'madre', TRUE, '2024-03-10');

-- Entradas de diario de ejemplo
INSERT INTO diario (usuario_id, fecha, texto, emocion, estado, semana_iso_year, semana_num, palabras_count, tiempo_escritura) VALUES
(2, '2024-12-15', 'Hoy mi hijo me contó que aprendió a sumar en la escuela. Estoy muy orgullosa de él y quiero que sepas que está creciendo muy bien.', 'orgulloso', 'aprobado', 2024, 50, 28, 120),
(2, '2024-12-16', 'Hoy fuimos al parque y jugamos juntos. Me siento muy feliz cuando veo su sonrisa. Te extraño mucho y espero verte pronto.', 'feliz', 'aprobado', 2024, 50, 25, 95),
(3, '2024-12-15', 'Mi hija me ayudó a cocinar hoy. Es increíble ver cómo está aprendiendo cosas nuevas cada día. Te amo mucho.', 'agradecido', 'aprobado', 2024, 50, 22, 110),
(4, '2024-12-16', 'Hoy fue un día tranquilo en casa. Mi hijo leyó un cuento y me contó la historia. Me siento muy tranquila y agradecida.', 'tranquilo', 'aprobado', 2024, 50, 24, 88);

-- Eventos de ejemplo
INSERT INTO eventos (tipo, titulo, descripcion, inicio, fin, all_day, creador_id, ubicacion, color, recordatorio_minutos, estado) VALUES
('visita_penal', 'Visita familiar', 'Visita programada al penal para ver a papá', '2024-12-20 10:00:00', '2024-12-20 12:00:00', FALSE, 2, 'CERESO Femenil Chihuahua', '#FF6B9D', 30, 'activo'),
('tramite', 'Cita médica', 'Revisión médica para el niño', '2024-12-18 14:00:00', '2024-12-18 15:00:00', FALSE, 2, 'Hospital Infantil', '#4A90E2', 15, 'activo'),
('evento_familiar', 'Cumpleaños de mamá', 'Celebración del cumpleaños', '2024-12-22 18:00:00', '2024-12-22 22:00:00', FALSE, 3, 'Casa', '#FFD700', 60, 'activo'),
('recordatorio_personal', 'Entrega de tarea', 'Recordatorio para entregar tarea de matemáticas', '2024-12-17 08:00:00', NULL, TRUE, 3, 'Escuela', '#90EE90', 15, 'activo');

-- Contenido de biblioteca de ejemplo
INSERT INTO biblioteca_item (categoria_id, titulo, autor, tipo, categoria, descripcion, url_recurso, nivel_educativo, edad_recomendada, idioma, activo) VALUES
(1, 'Matemáticas Divertidas', 'Prof. María García', 'libro', 'educativo', 'Libro de ejercicios de matemáticas para primaria', 'https://ejemplo.com/matematicas.pdf', 'primaria', '6-12', 'es', TRUE),
(1, 'Cuentos de Hadas', 'Colección Clásica', 'libro', 'infantil', 'Recopilación de cuentos tradicionales', 'https://ejemplo.com/cuentos.pdf', 'preescolar', '3-8', 'es', TRUE),
(1, 'Ciencias Naturales', 'Dr. Juan Pérez', 'libro', 'educativo', 'Libro de ciencias para secundaria', 'https://ejemplo.com/ciencias.pdf', 'secundaria', '12-15', 'es', TRUE),
(1, 'El Principito', 'Antoine de Saint-Exupéry', 'libro', 'infantil', 'Clásico de la literatura infantil', 'https://ejemplo.com/principito.pdf', 'primaria', '8-12', 'es', TRUE);

-- Apoyos de ejemplo
INSERT INTO apoyos (categoria_id, nombre, categoria, descripcion, telefono, email, direccion, horario_atencion, activo) VALUES
(1, 'Hospital Infantil de Chihuahua', 'Salud', 'Atención médica especializada en pediatría y urgencias para niñas y niños.', '614-214-4000', 'info@hospitalinfantil.ch', 'Av. Universidad 1000, Chihuahua', 'Lunes a viernes, 8:00 am - 3:00 pm', TRUE),
(1, 'Banco de Alimentos', 'Alimentacion', 'Distribución de alimentos básicos y nutritivos para familias en situación vulnerable.', '614-123-4567', 'info@bancodealimentos.ch', 'Av. Tecnológico 789, Chihuahua', 'Lunes a viernes, 9:00 am - 5:00 pm', TRUE),
(1, 'Centro de Asistencia Legal', 'Legal', 'Asesoría legal gratuita y representación jurídica para casos familiares y laborales.', '614-456-7890', 'legal@asistencia.ch', 'Calle Independencia 123, Chihuahua', 'Lunes a viernes, 9:00 am - 6:00 pm', TRUE),
(1, 'Centro de Salud Mental', 'Psicologia', 'Atención psicológica especializada para todas las edades. Terapia individual y familiar.', '614-777-8888', 'contacto@saludmental.ch', 'Calle Libertad 456, Chihuahua', 'Lunes a viernes, 9:00 am - 6:00 pm', TRUE);

-- Notificaciones de ejemplo
INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, datos_extra, enviada, leida) VALUES
(2, 'recordatorio', 'Recordatorio de evento', 'Tienes una visita programada mañana a las 10:00 AM', '{"evento_id": 1, "tipo": "visita_penal"}', TRUE, FALSE),
(3, 'sistema', 'Bienvenida', '¡Bienvenida a Conectando Corazones! Comienza a crear tu diario semanal.', '{"tipo": "bienvenida"}', TRUE, TRUE),
(4, 'evento', 'Nuevo evento', 'Se ha creado un nuevo evento en tu calendario', '{"evento_id": 3, "tipo": "evento_familiar"}', TRUE, FALSE);

-- Archivos multimedia de ejemplo
INSERT INTO archivos_multimedia (usuario_id, tipo, nombre_original, nombre_archivo, ruta_archivo, tamaño_bytes, mime_type, relacion_tabla, relacion_id) VALUES
(2, 'imagen', 'foto_parque.jpg', 'foto_parque_20241215.jpg', '/uploads/usuarios/2/fotos/foto_parque_20241215.jpg', 2048576, 'image/jpeg', 'diario', 1),
(3, 'imagen', 'cocina_familia.jpg', 'cocina_familia_20241215.jpg', '/uploads/usuarios/3/fotos/cocina_familia_20241215.jpg', 1536000, 'image/jpeg', 'diario', 3),
(4, 'imagen', 'lectura_cuento.jpg', 'lectura_cuento_20241216.jpg', '/uploads/usuarios/4/fotos/lectura_cuento_20241216.jpg', 1873408, 'image/jpeg', 'diario', 4);

-- Historial de llamadas de ejemplo
INSERT INTO historial_llamadas (usuario_id, numero_telefono, nombre_contacto, tipo_llamada, duracion_segundos, notas, relacion_tabla, relacion_id) VALUES
(2, '614-214-4000', 'Hospital Infantil', 'saliente', 180, 'Consulta sobre cita médica', 'apoyos', 1),
(3, '614-123-4567', 'Banco de Alimentos', 'saliente', 240, 'Información sobre despensas', 'apoyos', 2),
(4, '614-777-8888', 'Centro de Salud Mental', 'saliente', 300, 'Consulta sobre terapia familiar', 'apoyos', 4);

-- Visitas a ubicaciones de ejemplo
INSERT INTO visitas_ubicaciones (usuario_id, ubicacion_id, fecha_visita, notas, calificacion) VALUES
(2, 1, '2024-12-10 10:30:00', 'Excelente atención médica', 5),
(3, 2, '2024-12-12 14:15:00', 'Muy buena atención psicológica', 4),
(4, 3, '2024-12-14 09:00:00', 'Despensas muy completas', 5);

-- PDFs generados de ejemplo
INSERT INTO pdf_generados (usuario_id, carta_semanal_id, tipo, nombre_archivo, ruta_archivo, tamaño_bytes, fecha_generacion, estado) VALUES
(2, NULL, 'carta_semanal', 'semana_50_2024_maria.pdf', '/pdfs/usuarios/2/semana_50_2024_maria.pdf', 2048576, '2024-12-15 18:30:00', 'generado'),
(3, NULL, 'carta_semanal', 'semana_50_2024_ana.pdf', '/pdfs/usuarios/3/semana_50_2024_ana.pdf', 1873408, '2024-12-16 16:45:00', 'generado');

-- Cartas semanales de ejemplo
INSERT INTO carta_semanal (usuario_id, fecha_referencia, semana_iso_year, semana_num_iso, pdf_url, estado) VALUES
(2, '2024-12-15', 2024, 50, '/pdfs/usuarios/2/semana_50_2024_maria.pdf', 'generada'),
(3, '2024-12-16', 2024, 50, '/pdfs/usuarios/3/semana_50_2024_ana.pdf', 'generada');

-- Actualizar los PDFs generados con las cartas semanales
UPDATE pdf_generados SET carta_semanal_id = 1 WHERE usuario_id = 2;
UPDATE pdf_generados SET carta_semanal_id = 2 WHERE usuario_id = 3;

-- Métricas de ejemplo
INSERT INTO metricas_event (evento, usuario_id, datos_adicionales, created_at) VALUES
('login', 2, '{"plataforma": "mobile", "version": "1.0.0"}', '2024-12-15 08:30:00'),
('diario_creado', 2, '{"emocion": "orgulloso", "palabras": 28}', '2024-12-15 18:45:00'),
('evento_creado', 2, '{"tipo": "visita_penal", "fecha": "2024-12-20"}', '2024-12-15 19:00:00'),
('pdf_generado', 2, '{"tipo": "carta_semanal", "tamaño": 2048576}', '2024-12-15 18:30:00'),
('login', 3, '{"plataforma": "mobile", "version": "1.0.0"}', '2024-12-16 09:15:00'),
('diario_creado', 3, '{"emocion": "agradecido", "palabras": 22}', '2024-12-15 17:20:00'),
('llamada_realizada', 3, '{"numero": "614-123-4567", "duracion": 240}', '2024-12-16 10:30:00'),
('login', 4, '{"plataforma": "mobile", "version": "1.0.0"}', '2024-12-16 14:00:00'),
('diario_creado', 4, '{"emocion": "tranquilo", "palabras": 24}', '2024-12-16 16:10:00'),
('visita_ubicacion', 4, '{"ubicacion": "Banco de Alimentos", "calificacion": 5}', '2024-12-14 09:00:00');

-- Dispositivos de ejemplo
INSERT INTO dispositivo_tokens (usuario_id, token, plataforma, version_app, activo) VALUES
(2, 'fcm_token_maria_123456789', 'android', '1.0.0', TRUE),
(3, 'fcm_token_ana_987654321', 'android', '1.0.0', TRUE),
(4, 'fcm_token_carmen_456789123', 'android', '1.0.0', TRUE);

-- Configuraciones adicionales para usuarios
INSERT INTO configuraciones_usuario (usuario_id, clave, valor, tipo, descripcion) VALUES
(2, 'notificaciones_push', 'true', 'boolean', 'Recibir notificaciones push'),
(2, 'tema_app', 'claro', 'string', 'Tema de la aplicación'),
(2, 'idioma', 'es', 'string', 'Idioma de la aplicación'),
(2, 'recordatorios_eventos', '30', 'number', 'Minutos antes de recordar eventos'),
(3, 'notificaciones_push', 'true', 'boolean', 'Recibir notificaciones push'),
(3, 'tema_app', 'claro', 'string', 'Tema de la aplicación'),
(3, 'idioma', 'es', 'string', 'Idioma de la aplicación'),
(4, 'notificaciones_push', 'false', 'boolean', 'Recibir notificaciones push'),
(4, 'tema_app', 'oscuro', 'string', 'Tema de la aplicación'),
(4, 'idioma', 'es', 'string', 'Idioma de la aplicación');

-- Consentimientos de ejemplo
INSERT INTO consentimientos (usuario_id, tipo, otorgado, firmado_por, evidencia_url, version_consentimiento) VALUES
(2, 'uso_app', TRUE, 'María González Pérez', '/uploads/consentimientos/maria_uso_app.pdf', '1.0'),
(2, 'envio_diario_al_penal', TRUE, 'María González Pérez', '/uploads/consentimientos/maria_envio_diario.pdf', '1.0'),
(2, 'analitica_anonima', TRUE, 'María González Pérez', '/uploads/consentimientos/maria_analitica.pdf', '1.0'),
(3, 'uso_app', TRUE, 'Ana López Martínez', '/uploads/consentimientos/ana_uso_app.pdf', '1.0'),
(3, 'envio_diario_al_penal', TRUE, 'Ana López Martínez', '/uploads/consentimientos/ana_envio_diario.pdf', '1.0'),
(4, 'uso_app', TRUE, 'Carmen Rodríguez Silva', '/uploads/consentimientos/carmen_uso_app.pdf', '1.0'),
(4, 'envio_diario_al_penal', TRUE, 'Carmen Rodríguez Silva', '/uploads/consentimientos/carmen_envio_diario.pdf', '1.0');

-- =============================================
-- VISTAS (AL FINAL, DESPUÉS DE TODAS LAS TABLAS)
-- =============================================

-- Vista de diarios pendientes de revisión
CREATE OR REPLACE VIEW vw_diarios_pendientes_revision AS
SELECT
  d.id AS diario_id,
  d.usuario_id,
  d.fecha,
  d.emocion,
  d.estado,
  d.texto,
  d.palabras_count,
  u.nombre AS usuario_nombre,
  u.apellidos AS usuario_apellidos,
  r.ppl_id,
  ppl.penal_id,
  ppl.nombre AS ppl_nombre
FROM diario d
JOIN usuarios u ON u.id = d.usuario_id
LEFT JOIN relacion_ppl_usuario r ON r.usuario_id = u.id AND r.vigente = TRUE
LEFT JOIN ppl ON ppl.id = r.ppl_id
WHERE d.estado = 'enviado_revision';

-- Vista de cartas semanales aprobadas
CREATE OR REPLACE VIEW vw_cartas_semanales_aprobadas AS
SELECT 
  c.id, 
  c.usuario_id, 
  c.semana_iso_year, 
  c.semana_num_iso, 
  c.pdf_url, 
  c.fecha_envio_penal,
  u.nombre AS usuario_nombre,
  u.apellidos AS usuario_apellidos
FROM carta_semanal c
JOIN usuarios u ON u.id = c.usuario_id
WHERE c.estado = 'aprobada';

-- Vista de estadísticas administrativas
CREATE OR REPLACE VIEW vw_estadisticas_admin AS
SELECT 
  'usuarios_totales' as metrica,
  COUNT(*) as valor
FROM usuarios 
WHERE estado = 'activo'
UNION ALL
SELECT 
  'diarios_totales' as metrica,
  COUNT(*) as valor
FROM diario 
WHERE estado = 'aprobado'
UNION ALL
SELECT 
  'cartas_generadas' as metrica,
  COUNT(*) as valor
FROM carta_semanal 
WHERE estado IN ('generada', 'aprobada', 'enviada_penal')
UNION ALL
SELECT 
  'contenido_biblioteca' as metrica,
  COUNT(*) as valor
FROM biblioteca_item 
WHERE activo = TRUE
UNION ALL
SELECT 
  'apoyos_disponibles' as metrica,
  COUNT(*) as valor
FROM apoyos 
WHERE activo = TRUE
UNION ALL
SELECT 
  'pdfs_generados' as metrica,
  COUNT(*) as valor
FROM pdf_generados 
WHERE estado = 'generado'
UNION ALL
SELECT 
  'eventos_activos' as metrica,
  COUNT(*) as valor
FROM eventos 
WHERE estado = 'activo';

-- Vista de estadísticas detalladas por usuario
CREATE OR REPLACE VIEW vw_estadisticas_usuario_detalle AS
SELECT 
  u.id as usuario_id,
  u.nombre,
  u.apellidos,
  COUNT(DISTINCT d.id) as total_diarios,
  COUNT(DISTINCT c.id) as total_cartas,
  COUNT(DISTINCT e.id) as total_eventos,
  COUNT(DISTINCT p.id) as total_pdfs,
  COUNT(DISTINCT a.id) as total_archivos,
  COUNT(DISTINCT n.id) as total_notificaciones,
  MAX(d.created_at) as ultimo_diario,
  MAX(e.created_at) as ultimo_evento
FROM usuarios u
LEFT JOIN diario d ON d.usuario_id = u.id AND d.estado = 'aprobado'
LEFT JOIN carta_semanal c ON c.usuario_id = u.id
LEFT JOIN eventos e ON e.creador_id = u.id AND e.estado = 'activo'
LEFT JOIN pdf_generados p ON p.usuario_id = u.id
LEFT JOIN archivos_multimedia a ON a.usuario_id = u.id AND a.activo = TRUE
LEFT JOIN notificaciones n ON n.usuario_id = u.id
WHERE u.estado = 'activo'
GROUP BY u.id, u.nombre, u.apellidos;

-- Vista de notificaciones pendientes
CREATE OR REPLACE VIEW vw_notificaciones_pendientes AS
SELECT
  n.id,
  n.usuario_id,
  n.tipo,
  n.titulo,
  n.mensaje,
  n.created_at,
  u.nombre as usuario_nombre,
  u.email as usuario_email
FROM notificaciones n
JOIN usuarios u ON u.id = n.usuario_id
WHERE n.enviada = FALSE AND n.leida = FALSE
ORDER BY n.created_at DESC;

-- Vista de archivos por usuario
CREATE OR REPLACE VIEW vw_archivos_usuario AS
SELECT
  a.id,
  a.usuario_id,
  a.tipo,
  a.nombre_original,
  a.tamaño_bytes,
  a.created_at,
  u.nombre as usuario_nombre,
  a.relacion_tabla,
  a.relacion_id
FROM archivos_multimedia a
JOIN usuarios u ON u.id = a.usuario_id
WHERE a.activo = TRUE
ORDER BY a.created_at DESC;

-- Vista de ubicaciones cercanas
CREATE OR REPLACE VIEW vw_ubicaciones_cercanas AS
SELECT
  u.id,
  u.nombre,
  u.direccion,
  u.latitud,
  u.longitud,
  u.tipo,
  u.telefono,
  u.horario_atencion,
  COUNT(v.id) as total_visitas,
  AVG(v.calificacion) as calificacion_promedio
FROM ubicaciones u
LEFT JOIN visitas_ubicaciones v ON v.ubicacion_id = u.id
WHERE u.activo = TRUE
GROUP BY u.id, u.nombre, u.direccion, u.latitud, u.longitud, u.tipo, u.telefono, u.horario_atencion
ORDER BY total_visitas DESC;

-- =============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =============================================

CREATE INDEX idx_diario_usuario_fecha_estado ON diario(usuario_id, fecha, estado);
CREATE INDEX idx_eventos_creador_tipo_fecha ON eventos(creador_id, tipo, inicio);
CREATE INDEX idx_notificaciones_usuario_tipo_leida ON notificaciones(usuario_id, tipo, leida);
CREATE INDEX idx_metricas_usuario_evento_fecha ON metricas_event(usuario_id, evento, created_at);

-- =============================================
-- COMENTARIOS FINALES
-- =============================================

/*
ESTRUCTURA SIMPLIFICADA PARA CONECTANDO CORAZONES

Esta base de datos ha sido diseñada específicamente para la aplicación "Conectando Corazones"
y está optimizada para TiDB con las siguientes características:

✅ COMPATIBLE CON TiDB:
- Todos los tipos de datos son compatibles
- Sin stored procedures, triggers o functions
- Foreign keys definidas pero no aplicadas automáticamente
- Índices optimizados para consultas frecuentes

✅ FUNCIONALIDADES CUBIERTAS:
- Sistema de usuarios simplificado (ADMIN y USUARIO)
- Diario emocional con estados de revisión
- Biblioteca escolar con categorías
- Directorio de apoyos por categorías
- Calendario de eventos
- Sistema de notificaciones push
- Archivos multimedia
- Ubicaciones y visitas
- Historial de llamadas
- Configuraciones personalizadas
- Métricas y auditoría
- Información de FAFORE

✅ DATOS DE EJEMPLO INCLUIDOS:
- 3 usuarios de ejemplo con diferentes perfiles
- Entradas de diario con emociones variadas
- Eventos de calendario programados
- Contenido de biblioteca educativa
- Centros de apoyo del directorio
- Notificaciones y archivos multimedia
- Métricas y configuraciones

La base de datos está lista para usar con el frontend React Native.
*/
