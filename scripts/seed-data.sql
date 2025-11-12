-- Script para insertar datos iniciales del sistema de blog
-- Base de datos: asistecare

USE asistecare;

-- Insertar administrador por defecto
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO admins (username, email, password, name, active) 
VALUES ('admin', 'admin@asistehealthcare.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsKXSZZJ6', 'Administrador', TRUE)
ON DUPLICATE KEY UPDATE 
    email = VALUES(email),
    name = VALUES(name),
    active = VALUES(active);

-- Insertar posts de ejemplo del blog
INSERT INTO blog_posts (title, slug, excerpt, content, image, category, tags, metaTitle, metaDescription, readTime, published, featured, authorId) 
VALUES 
(
    'Guía Completa para Entender Obamacare en 2024',
    'guia-completa-entender-obamacare-2024',
    'Todo lo que necesitas saber sobre la Ley de Cuidado de Salud a Bajo Precio, sus beneficios y cómo aplicar para obtener cobertura médica.',
    '# Guía Completa para Entender Obamacare en 2024

## ¿Qué es Obamacare?

La Ley de Cuidado de Salud a Bajo Precio (ACA), conocida comúnmente como Obamacare, es una reforma integral del sistema de salud de los Estados Unidos que fue firmada en 2010.

## Beneficios Principales

- **Protección contra condiciones preexistentes**: Las aseguradoras no pueden negar cobertura o cobrar más por condiciones médicas preexistentes.
- **Servicios preventivos gratuitos**: Muchos servicios de prevención están cubiertos sin costo adicional.
- **Subsidios gubernamentales**: Ayuda financiera disponible para familias de bajos y medianos ingresos.

## Cómo Aplicar

1. Visita HealthCare.gov durante el período de inscripción abierta
2. Compara los planes disponibles en tu área
3. Verifica si calificas para subsidios
4. Completa tu inscripción antes de la fecha límite

Para más información personalizada, contacta a nuestros expertos en Asiste Health Care.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Guías',
    'obamacare, aca, seguro medico, guia',
    'Guía Completa de Obamacare 2024 - Todo lo que Necesitas Saber',
    'Aprende todo sobre Obamacare: beneficios, requisitos y cómo aplicar. Guía completa actualizada para 2024.',
    8,
    TRUE,
    TRUE,
    1
),
(
    'Diferencias entre HMO, PPO y EPO: ¿Cuál Elegir?',
    'diferencias-hmo-ppo-epo-cual-elegir',
    'Una comparación detallada de los diferentes tipos de planes de seguro médico para ayudarte a tomar la mejor decisión.',
    '# Diferencias entre HMO, PPO y EPO: ¿Cuál Elegir?

Elegir el tipo correcto de plan de seguro médico es crucial para obtener la mejor cobertura al mejor precio.

## HMO (Health Maintenance Organization)

- **Ventajas**: Costos más bajos, coordinación de atención
- **Desventajas**: Red limitada de médicos, necesitas referencias
- **Ideal para**: Personas que prefieren costos predecibles y no les importa tener un médico de atención primaria

## PPO (Preferred Provider Organization)

- **Ventajas**: Mayor flexibilidad, cobertura fuera de la red
- **Desventajas**: Costos más altos, deducibles más altos
- **Ideal para**: Personas que valoran la flexibilidad y tienen médicos específicos

## EPO (Exclusive Provider Organization)

- **Ventajas**: Balance entre costo y flexibilidad
- **Desventajas**: No hay cobertura fuera de la red (excepto emergencias)
- **Ideal para**: Personas que quieren flexibilidad sin pagar extra por cobertura fuera de red',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Seguros Médicos',
    'hmo, ppo, epo, tipos de planes',
    NULL,
    NULL,
    6,
    TRUE,
    FALSE,
    1
),
(
    'Período de Inscripción Abierta 2024: Fechas Importantes',
    'periodo-inscripcion-abierta-2024-fechas',
    'Conoce las fechas clave para inscribirte en un plan de seguro médico y qué hacer si pierdes el período de inscripción abierta.',
    '# Período de Inscripción Abierta 2024: Fechas Importantes

## Fechas del Período de Inscripción Abierta

- **Inicio**: 1 de noviembre de 2023
- **Fin**: 15 de enero de 2024
- **Cobertura**: Comienza el 1 de enero de 2024

## ¿Qué Puedes Hacer?

Durante este período puedes:
- Inscribirte en un nuevo plan
- Cambiar tu plan actual
- Renovar tu plan existente
- Cancelar tu cobertura

## ¿Perdiste el Período?

Si perdiste la inscripción abierta, aún puedes inscribirte si:
- Tienes un evento de vida calificado
- Calificas para Medicaid o CHIP
- Eres elegible para una excepción especial

Contacta a Asiste Health Care para conocer tus opciones.',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Noticias',
    'inscripcion abierta, fechas, 2024',
    NULL,
    NULL,
    4,
    TRUE,
    TRUE,
    1
)
ON DUPLICATE KEY UPDATE 
    title = VALUES(title),
    excerpt = VALUES(excerpt),
    content = VALUES(content),
    published = VALUES(published),
    featured = VALUES(featured);

SELECT 'Datos iniciales insertados exitosamente' as status;