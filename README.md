# Asiste Health Care - Sitio Web

Una página web moderna y profesional para **Asiste Health Care**, especializada en seguros médicos Obamacare (ACA). Construida con Next.js 14, React 18, TypeScript y Tailwind CSS.

## 🚀 Características

- **Diseño moderno y responsive** inspirado en la bandera de Estados Unidos
- **Animaciones suaves** con Framer Motion
- **Formulario de contacto funcional** con validación
- **SEO optimizado** para mejores rankings
- **Totalmente accesible** y compatible con dispositivos móviles
- **Lista para despliegue** en Vercel

## 🛠️ Stack Técnico

- **Framework:** Next.js 14 con App Router
- **Frontend:** React 18 + TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Formularios:** React Hook Form + Zod
- **Email:** Nodemailer
- **Despliegue:** Vercel

## 🎨 Paleta de Colores

- **Azul marino:** `#1E3A8A` - Color principal
- **Rojo coral:** `#DC2626` - Color secundario
- **Blanco hielo:** `#F9FAFB` - Fondo
- **Azul claro:** `#E0F2FE` - Acentos

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/contact/          # API endpoint para formulario
│   ├── blog/                 # Página de blog
│   ├── contacto/             # Página de contacto
│   ├── faq/                  # Preguntas frecuentes
│   ├── quienes-somos/        # Página sobre nosotros
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página de inicio
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Navegación principal
│   │   └── Footer.tsx        # Pie de página
│   └── ui/
│       ├── Accordion.tsx     # Componente acordeón
│       ├── ContactForm.tsx   # Formulario de contacto
│       └── FloatingButtons.tsx # Botones flotantes
└── ...
```

## 🚀 Instalación y Desarrollo

1. **Instala las dependencias:**
```bash
npm install
```

2. **Configura las variables de entorno:**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tu configuración:
```
# Database MySQL
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/asistecare"

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
CONTACT_EMAIL=contacto@asistehealthcare.com
```

3. **Configura la base de datos MySQL:**
```bash
# Crear la base de datos
mysql -u root -p
CREATE DATABASE asistecare;
exit

# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/asistecare" npx prisma migrate dev --name init
```

4. **Ejecuta el servidor de desarrollo:**
```bash
npm run dev
```

5. **Abre tu navegador en:** `http://localhost:3000`

## 📧 Configuración del Email

Para que el formulario de contacto funcione correctamente:

1. **Gmail:** Usa una contraseña de aplicación
2. **Outlook:** Configura SMTP con autenticación
3. **Otros proveedores:** Actualiza las variables SMTP según corresponda

### Ejemplo para Gmail:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
```

## 🌐 Despliegue en Vercel

1. **Conecta tu repositorio a Vercel**
2. **Configura las variables de entorno** en el dashboard de Vercel
3. **Despliega automáticamente** con cada push

### Variables de entorno para producción:
- `DATABASE_URL` (conexión MySQL)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_EMAIL`

## 📱 Características del Sitio

### Página de Inicio (`/`)
- Hero banner con llamada a la acción
- Sección de características principales
- Carrusel de aseguradoras
- Testimonios de clientes
- Formulario de contacto en footer

### Quiénes Somos (`/quienes-somos`)
- Historia de la empresa
- Valores corporativos
- Estadísticas de confianza
- Equipo y experiencia

### FAQ (`/faq`)
- 10 preguntas frecuentes sobre Obamacare
- Componente acordeón interactivo
- Información de contacto adicional

### Blog (`/blog`)
- Artículos sobre seguros médicos
- Sistema de categorías
- Diseño de tarjetas moderno

### Contacto (`/contacto`)
- Formulario funcional con validación
- Información de contacto completa
- Horarios de atención
- Enlaces de emergencia

### Admin (`/admin`)
- Panel de administración para gestionar reseñas
- Aprobar/rechazar reseñas de clientes
- Ver todos los contactos recibidos
- Eliminar contenido inapropiado

## 🗄️ Base de Datos

**Tablas creadas:**
- **`reviews`** - Reseñas de clientes con sistema de aprobación
- **`contacts`** - Formularios de contacto recibidos

**Sistema de reseñas:**
- Los usuarios envían reseñas que quedan pendientes de aprobación
- Los administradores pueden aprobar/rechazar desde `/admin`
- Solo las reseñas aprobadas se muestran en el sitio público
- Sistema de notificación por email para nuevas reseñas

## 🎯 Funcionalidades

- **Responsive Design:** Optimizado para móviles, tablets y desktop
- **Animaciones:** Transiciones suaves y efectos de hover
- **SEO:** Meta tags optimizados y estructura semántica
- **Accesibilidad:** Cumple estándares WCAG
- **Performance:** Optimizado para Core Web Vitals

## 📞 Contacto

- **Teléfono:** (346) 463-3745
- **WhatsApp:** (786) 533-0345
- **Email:** info@asistehealthcare.com

## 📄 Licencia

Este proyecto es propietario de Asiste Health Care. Todos los derechos reservados.

---

**Desarrollado con ❤️ para ayudar a las familias a encontrar el seguro médico perfecto.**
