# Global Law CRM

Sistema de gestión de relaciones con clientes (CRM) diseñado específicamente para Global Law, una firma de abogados. Esta aplicación permite gestionar clientes, procesos legales, y el flujo de trabajo de casos.

## 🚀 Características

- **Dashboard interactivo** con métricas en tiempo real
- **Gestión de clientes** con información detallada y notas
- **Sistema Kanban** para seguimiento de procesos legales
- **Tabla de clientes** con filtros avanzados
- **Sistema de notificaciones** 
- **Gestión de usuarios** con diferentes roles
- **Integración con Meta API** para automatización

## 🛠️ Tecnologías

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Build Tool**: Vite
- **Deploy**: GitHub Pages

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/William-Pardo/Global_Law.git

# Navegar al directorio
cd Global_Law

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🌐 Demo en Vivo

La aplicación está desplegada en: [https://william-pardo.github.io/Global_Law/](https://william-pardo.github.io/Global_Law/)

## 📁 Estructura del Proyecto

```
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI reutilizables
│   ├── Dashboard.tsx   # Panel principal
│   ├── KanbanBoard.tsx # Tablero Kanban
│   └── ...
├── contexts/           # Contextos de React
├── services/           # Servicios y APIs
├── types.ts           # Definiciones de TypeScript
└── constants.ts       # Constantes globales
```

## 🔧 Configuración

1. Crea un archivo `.env.local` en la raíz del proyecto:
```bash
GEMINI_API_KEY=tu_api_key_aqui
```

2. Configura las variables de entorno según tus necesidades.

## 📄 Licencia

Este proyecto es privado y pertenece a Global Law.

## 👨‍💻 Desarrollador

Desarrollado por William Pardo
- GitHub: [@William-Pardo](https://github.com/William-Pardo)
