-- Insertar libros educativos reales de Primaria (5to grado)
-- Basado en las URLs proporcionadas

-- Libro de Español (categoria_id = 1 - Educativo)
INSERT INTO biblioteca_item (
    categoria_id,
    titulo, 
    descripcion, 
    nivel_educativo, 
    categoria, 
    url_recurso, 
    autor, 
    tipo, 
    edad_recomendada, 
    idioma, 
    activo
) VALUES (
    1,
    'Español Quinto Grado',
    'Libro de texto gratuito de Español para quinto grado de primaria. Incluye actividades de lectura, escritura, comprensión lectora y expresión oral.',
    'primaria',
    'español',
    'https://guao.org/sites/default/files/biblioteca/Espa%C3%B1ol.%20Quinto%20grado.pdf',
    'Secretaría de Educación Pública',
    'libro',
    '10-11',
    'es',
    1
);

-- Libro de Matemáticas (categoria_id = 4 - Matemáticas)
INSERT INTO biblioteca_item (
    categoria_id,
    titulo, 
    descripcion, 
    nivel_educativo, 
    categoria, 
    url_recurso, 
    autor, 
    tipo, 
    edad_recomendada, 
    idioma, 
    activo
) VALUES (
    4,
    'Matemáticas Sexto Grado',
    'Libro de texto gratuito de Matemáticas para sexto grado de primaria. Contiene ejercicios de aritmética, geometría, álgebra y resolución de problemas.',
    'primaria',
    'matemáticas',
    'https://inforcap.com.mx/Matematicas/primaria/06Grado/index_htm_files/Mat6.pdf',
    'Secretaría de Educación Pública',
    'libro',
    '11-12',
    'es',
    1
);

-- Libro de Ciencias Naturales (categoria_id = 3 - Ciencias)
INSERT INTO biblioteca_item (
    categoria_id,
    titulo, 
    descripcion, 
    nivel_educativo, 
    categoria, 
    url_recurso, 
    autor, 
    tipo, 
    edad_recomendada, 
    idioma, 
    activo
) VALUES (
    3,
    'Ciencias Naturales Quinto Grado',
    'Libro de texto gratuito de Ciencias Naturales para quinto grado de primaria. Incluye temas de biología, física, química y ciencias de la tierra.',
    'primaria',
    'ciencias',
    'https://www.guao.org/sites/default/files/biblioteca/Ciencias%20Naturales.%20Quinto%20grado.%20M%C3%A9xico.pdf',
    'Secretaría de Educación Pública',
    'libro',
    '10-11',
    'es',
    1
);

-- Libro de Historia (categoria_id = 1 - Educativo)
INSERT INTO biblioteca_item (
    categoria_id,
    titulo, 
    descripcion, 
    nivel_educativo, 
    categoria, 
    url_recurso, 
    autor, 
    tipo, 
    edad_recomendada, 
    idioma, 
    activo
) VALUES (
    1,
    'Historia Quinto Grado',
    'Libro de texto gratuito de Historia para quinto grado de primaria. Aborda la historia de México desde la época prehispánica hasta la independencia.',
    'primaria',
    'historia',
    'https://cientificoloco2020.wordpress.com/wp-content/uploads/2014/08/5o-historia-2014-2015.pdf',
    'Secretaría de Educación Pública',
    'libro',
    '10-11',
    'es',
    1
);

-- Libro de Formación Cívica y Ética (categoria_id = 1 - Educativo)
INSERT INTO biblioteca_item (
    categoria_id,
    titulo, 
    descripcion, 
    nivel_educativo, 
    categoria, 
    url_recurso, 
    autor, 
    tipo, 
    edad_recomendada, 
    idioma, 
    activo
) VALUES (
    1,
    'Formación Cívica y Ética Quinto Grado',
    'Libro de texto gratuito de Formación Cívica y Ética para quinto grado de primaria. Desarrolla valores, derechos humanos y participación ciudadana.',
    'primaria',
    'cívica',
    'http://www.escuelatransparente.gob.mx/transparencia/documentos/libros/FormacionCivicayEtica5toprimaria.pdf',
    'Secretaría de Educación Pública',
    'libro',
    '10-11',
    'es',
    1
);

-- Verificar los libros insertados
SELECT 
    id, 
    titulo, 
    nivel_educativo, 
    categoria, 
    url_recurso,
    autor
FROM biblioteca_item 
WHERE nivel_educativo = 'primaria' 
AND categoria IN ('español', 'matemáticas', 'ciencias', 'historia', 'cívica')
ORDER BY categoria;
