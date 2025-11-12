# 🚀 Despliegue en VPS - Asiste Health Care

## 📋 Pasos para desplegar

### 1. Clonar repositorio en VPS
```bash
cd /var/www
git clone https://github.com/davidzaratecamp/asistehealpagina.git asiste-healthcare
cd asiste-healthcare
```

### 2. Configurar variables de entorno
```bash
cp .env.production .env
# Editar .env con las credenciales correctas
nano .env
```

### 3. Instalar dependencias y construir
```bash
npm install
npm run build
```

### 4. Crear base de datos
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS asistecare;"
mysql -u root -p asistecare < scripts/create-tables.sql
```

### 5. Configurar PM2
```bash
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configurar Nginx
Crear archivo: `/etc/nginx/sites-available/asiste-healthcare`

```nginx
server {
    listen 80;
    server_name tudominio.com; # Cambiar por tu dominio
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/asiste-healthcare /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 🔧 Comandos útiles

```bash
# Ver logs de la aplicación
pm2 logs asiste-healthcare

# Reiniciar aplicación
pm2 restart asiste-healthcare

# Ver estado
pm2 status

# Actualizar aplicación
git pull
npm run build
pm2 restart asiste-healthcare
```

## 📊 Acceso
- **Aplicación**: http://31.97.138.23:3001
- **Admin**: http://31.97.138.23:3001/admin/login
- **Credenciales**: admin / admin123