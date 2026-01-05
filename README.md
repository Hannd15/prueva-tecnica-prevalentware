# Guía de Configuración y Despliegue - Finanzas App

Este documento proporciona instrucciones detalladas para ejecutar el proyecto localmente y desplegarlo en Vercel, cumpliendo con los requisitos de la prueba técnica.

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- **Node.js** (v18 o superior)
- **npm** o **pnpm**
- Una cuenta en **GitHub** (para OAuth)
- Una base de datos **PostgreSQL**

---

## 2. Configuración Local

### Paso 1: Preparar GitHub OAuth para Desarrollo
Debes crear una **nueva** OAuth App en GitHub para el entorno de producción:
- **Homepage URL**: `http://localhost:3000`
- **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

### Paso 2: Clonar el repositorio
```bash
git clone https://github.com/Hannd15/prueva-tecnica-prevalentware.git
cd prueba-tecnica-prevalentware
```

### Paso 3: Instalar dependencias
```bash
npm install
```

### Paso 4: Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Base de Datos
DATABASE_URL="URL de conexión a la base de datos"

# Better Auth Configuration
BETTER_AUTH_SECRET="Un secreto aleatorio de al menos 32 caracteres"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth (Obtener en GitHub -> Settings -> Developer Settings -> OAuth Apps)
GITHUB_CLIENT_ID="ID del cliente"
GITHUB_CLIENT_SECRET="Secreto del cliente"
```

### Paso 5: Preparar la Base de Datos
Ejecuta las migraciones de Prisma para crear las tablas necesarias:
```bash
npx prisma migrate dev
```

### Paso 6: Ejecutar el proyecto
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## 5. Despliegue en Vercel

### Paso 1: Preparar GitHub OAuth para Producción
Debes crear una **nueva** OAuth App en GitHub para el entorno de producción:
- **Homepage URL**: `https://tu-app.vercel.app`
- **Authorization callback URL**: `https://tu-app.vercel.app/api/auth/callback/github`

### Paso 2: Desplegar en Vercel
1. Sube tu código a un repositorio de GitHub.
2. En el dashboard de Vercel, haz clic en **"New Project"** e importa el repositorio.
3. En **Build & Output Settings**, asegúrate de que el comando de instalación sea `npm install` y el comando de build sea `npm run build`.
4. En la sección **Environment Variables**, agrega todas las variables definidas en tu `.env`, pero actualiza `BETTER_AUTH_URL` con la URL de producción de Vercel.
5. Haz clic en **Deploy**.

### Paso 3: Post-Despliegue
Vercel ejecutará automáticamente `prisma generate` durante el build. Asegúrate de que tu base de datos de Supabase sea accesible desde las IPs de Vercel.

---

## 6. Documentación de la API (Swagger)

Una vez que el proyecto esté en ejecución, puedes acceder a la documentación interactiva de la API en: `[URL]/api/docs`
