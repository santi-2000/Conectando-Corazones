-- Crear tabla de eventos del calendario
CREATE TABLE IF NOT EXISTS calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_evento DATE NOT NULL,
    hora_evento TIME,
    color VARCHAR(7) NOT NULL DEFAULT '#4A90E2',
    tipo_evento ENUM('familiar', 'deportivo', 'recordatorio', 'diferente', 'medico', 'educativo') NOT NULL DEFAULT 'recordatorio',
    nivel_importancia ENUM('Alto', 'Medio', 'Bajo') NOT NULL DEFAULT 'Medio',
    recordatorio_activo BOOLEAN DEFAULT TRUE,
    recordatorio_minutos INT DEFAULT 15,
    ubicacion VARCHAR(255),
    notas_adicionales TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_fecha_evento (fecha_evento),
    INDEX idx_tipo_evento (tipo_evento),
    INDEX idx_activo (activo)
);

-- Insertar datos de ejemplo
INSERT INTO calendar_events (
    user_id, titulo, descripcion, fecha_evento, hora_evento, color, tipo_evento, nivel_importancia, ubicacion
) VALUES 
('user123', 'Cumpleaños de mamá', 'Celebración familiar del cumpleaños de mamá', '2024-06-04', '18:00:00', '#FFD700', 'familiar', 'Alto', 'Casa'),
('user123', 'Día familiar', 'Reunión familiar mensual', '2024-06-06', '12:00:00', '#FFD700', 'familiar', 'Alto', 'Restaurante familiar'),
('user123', 'Cita médica', 'Revisión médica de rutina', '2024-06-10', '10:30:00', '#4A90E2', 'medico', 'Alto', 'Clínica San José'),
('user123', 'Partido de fútbol', 'Partido de fútbol del equipo local', '2024-06-11', '16:00:00', '#90EE90', 'deportivo', 'Medio', 'Estadio Municipal'),
('user123', 'Evento especial', 'Evento cultural especial', '2024-06-13', '19:00:00', '#FF69B4', 'diferente', 'Medio', 'Centro Cultural'),
('user123', 'Entrenamiento', 'Entrenamiento de fútbol', '2024-06-14', '17:00:00', '#90EE90', 'deportivo', 'Medio', 'Cancha deportiva'),
('user123', 'Competencia', 'Competencia deportiva regional', '2024-06-18', '09:00:00', '#90EE90', 'deportivo', 'Alto', 'Complejo deportivo'),
('user123', 'Reunión familiar', 'Reunión familiar mensual', '2024-06-19', '15:00:00', '#FFD700', 'familiar', 'Alto', 'Casa de los abuelos'),
('user123', 'Entrega de proyecto', 'Entrega del proyecto final', '2024-06-20', '14:00:00', '#4A90E2', 'educativo', 'Alto', 'Universidad'),
('user123', 'Visita al penitencial', 'Visita al centro penitenciario', '2024-06-22', '10:00:00', '#9370DB', 'diferente', 'Medio', 'Centro penitenciario'),
('user123', 'Evento cultural', 'Presentación cultural', '2024-06-23', '20:00:00', '#FF69B4', 'diferente', 'Medio', 'Teatro municipal'),
('user123', 'Reunión importante', 'Reunión de trabajo importante', '2024-06-26', '11:00:00', '#4A90E2', 'recordatorio', 'Alto', 'Oficina principal');
