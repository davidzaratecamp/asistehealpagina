const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos iniciales...');

  // Crear admin por defecto
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@asistehealthcare.com',
      password: hashedPassword,
      name: 'Administrador',
      active: true,
    },
  });

  console.log('✅ Admin creado:', { id: admin.id, username: admin.username, email: admin.email });

  // Crear algunos posts de ejemplo
  const samplePosts = [
    {
      title: 'Guía Completa para Entender Obamacare en 2024',
      slug: 'guia-completa-entender-obamacare-2024',
      excerpt: 'Todo lo que necesitas saber sobre la Ley de Cuidado de Salud a Bajo Precio, sus beneficios y cómo aplicar para obtener cobertura médica.',
      content: `# Guía Completa para Entender Obamacare en 2024

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

Para más información personalizada, contacta a nuestros expertos en Asiste Health Care.`,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Guías',
      tags: 'obamacare, aca, seguro medico, guia',
      metaTitle: 'Guía Completa de Obamacare 2024 - Todo lo que Necesitas Saber',
      metaDescription: 'Aprende todo sobre Obamacare: beneficios, requisitos y cómo aplicar. Guía completa actualizada para 2024.',
      readTime: 8,
      published: true,
      featured: true,
      authorId: admin.id,
    },
    {
      title: 'Diferencias entre HMO, PPO y EPO: ¿Cuál Elegir?',
      slug: 'diferencias-hmo-ppo-epo-cual-elegir',
      excerpt: 'Una comparación detallada de los diferentes tipos de planes de seguro médico para ayudarte a tomar la mejor decisión.',
      content: `# Diferencias entre HMO, PPO y EPO: ¿Cuál Elegir?

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
- **Ideal para**: Personas que quieren flexibilidad sin pagar extra por cobertura fuera de red`,
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Seguros Médicos',
      tags: 'hmo, ppo, epo, tipos de planes',
      readTime: 6,
      published: true,
      featured: false,
      authorId: admin.id,
    },
    {
      title: 'Período de Inscripción Abierta 2024: Fechas Importantes',
      slug: 'periodo-inscripcion-abierta-2024-fechas',
      excerpt: 'Conoce las fechas clave para inscribirte en un plan de seguro médico y qué hacer si pierdes el período de inscripción abierta.',
      content: `# Período de Inscripción Abierta 2024: Fechas Importantes

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

Contacta a Asiste Health Care para conocer tus opciones.`,
      category: 'Noticias',
      tags: 'inscripcion abierta, fechas, 2024',
      readTime: 4,
      published: true,
      featured: true,
      authorId: admin.id,
    }
  ];

  console.log('📝 Creando posts de ejemplo...');
  
  for (const postData of samplePosts) {
    const post = await prisma.blogPost.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData,
    });
    console.log('✅ Post creado:', post.title);
  }

  console.log('🎉 Datos sembrados exitosamente!');
  console.log('\n📋 Credenciales del administrador:');
  console.log('   Usuario: admin');
  console.log('   Contraseña: admin123');
  console.log('   URL de login: http://localhost:3000/admin/login');
}

main()
  .catch((e) => {
    console.error('❌ Error sembrando datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });