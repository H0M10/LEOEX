# 🚀 LEO Space Platform - Plataforma de Intercambio de Datos Satelitales

## 📋 Descripción del Proyecto

**LEO Space Platform** es una aplicación web full-stack que simula un ecosistema completo de gestión e intercambio de datos satelitales en órbita terrestre baja (LEO). La plataforma combina elementos de gamificación con funcionalidades empresariales reales para crear una experiencia interactiva de gestión espacial.

## 🎯 Objetivos del Proyecto

- Crear un simulador realista de gestión de misiones espaciales LEO
- Desarrollar un marketplace de datos satelitales con proveedores reales
- Implementar sistemas de filtrado avanzado y visualización de datos
- Proporcionar una interfaz profesional para análisis de sostenibilidad espacial

## 🏗️ Arquitectura Técnica

### **Frontend (React + Vite)**
- **Framework:** React 18 con Vite para desarrollo rápido
- **Diseño:** Bootstrap 5 + Animate.css para UI/UX profesional
- **Estado:** React Hooks para gestión de estado local
- **API Calls:** Axios con timeout y manejo de errores robusto
- **Componentes:** Arquitectura modular con componentes reutilizables

### **Backend (Node.js + Express)**
- **Runtime:** Node.js con Express.js
- **APIs:** RESTful endpoints para gestión de juegos y datos
- **Datos Reales:** Integración con APIs públicas de NASA/ESA
- **CORS:** Configurado para desarrollo multiplataforma
- **Persistencia:** Sistema de archivos JSON para estados de juego

### **Integración de Datos Reales**
- **Fuente:** API de TLE (Two-Line Elements) para satélites reales
- **Filtrado:** Sistema inteligente para datos de NASA, ESA, SpaceX, etc.
- **Fallback:** Datos curados de proveedores reales como respaldo

## 🌟 Funcionalidades Principales

### **1. Simulador de Juego Espacial**
- Sistema de turnos para gestión de misiones LEO
- Motor de juego con estados persistentes
- Gestión de presupuesto y recursos satelitales
- Mecánicas de riesgo y recompensa realistas

### **2. LEO Data Exchange (Marketplace)**
- **Catálogo de Proveedores Reales:**
  - NASA Earth Observation
  - ESA Copernicus Program
  - SpaceX Starlink
  - Planet Labs
  - Maxar Technologies
  - JAXA Earth Observation

- **Sistema de Filtrado Avanzado:**
  - Filtro por servicio (Observación, Comunicaciones, etc.)
  - Filtro por país/región
  - Reputación por estrellas (⭐ 1-5)
  - Sostenibilidad por niveles (🌱 1-5)
  - Certificación LEO (🏆)

### **3. Visualización y Analytics**
- Ranking TOP 3 de proveedores por reputación
- Gráficos de distribución de servicios
- Sistema de reviews y calificaciones
- Panel flotante de detalles con hover
- Modo comparación entre proveedores

### **4. UI/UX Profesional**
- Diseño responsivo con Bootstrap 5
- Animaciones fluidas con Animate.css
- Tooltips informativos
- Iconografía Font Awesome
- Paleta de colores profesional

## 🔧 Características Técnicas Avanzadas

### **Manejo de Errores Robusto**
- Timeout de APIs configurables
- Fallback a datos locales si falla API externa
- Mensajes de error user-friendly
- Logging detallado en backend

### **Filtrado Inteligente**
- Lógica de filtrado combinada (AND/OR)
- Búsqueda por texto en nombres y servicios
- Filtros visuales con iconos y badges
- Estado persistente de filtros

### **Gestión de Estado**
- useState para estado local de componentes
- useEffect para llamadas de API
- Patrón de carga asíncrona con spinners
- Manejo de arrays vacíos y errores de red

### **APIs y Endpoints**
```
GET /api/providers/reales - Obtener proveedores satelitales
POST /api/game/start - Iniciar nueva misión
POST /api/game/:id/step - Ejecutar turno de juego
GET /health - Health check del servidor
```

## 📊 Datos y Métricas del Sistema

### **Proveedores Implementados:** 6 empresas reales
### **Servicios Disponibles:** 
- Observación Terrestre
- Monitoreo Climático
- Conectividad Global
- Análisis de Imágenes
- Disaster Monitoring

### **Métricas de Calidad:**
- Reputación: 4.5-4.9/5.0
- Sostenibilidad: 75-98%
- Certificación LEO: 67% de proveedores

## 🎨 Diseño y Experiencia de Usuario

### **Paleta Visual:**
- Azul primario (#007bff) para elementos principales
- Verde para sostenibilidad y datos positivos
- Amarillo/Dorado para certificaciones y rankings
- Grises para elementos secundarios

### **Componentes Interactivos:**
- Cards con hover effects para proveedores
- Progress bars animadas para sostenibilidad
- Badges dinámicos para certificaciones
- Modales para acciones complejas

### **Responsive Design:**
- Grid system de Bootstrap
- Componentes adaptables
- Navegación optimizada para móvil

## 🚀 Casos de Uso Implementados

1. **Exploración de Proveedores:** Usuario busca servicios satelitales específicos
2. **Comparación de Empresas:** Análisis lado a lado de diferentes proveedores
3. **Filtrado por Certificación:** Búsqueda de proveedores certificados LEO
4. **Simulación de Misión:** Gestión completa de misión espacial
5. **Análisis de Sostenibilidad:** Evaluación de impacto ambiental

## 🔮 Tecnologías y Dependencias

### **Frontend:**
```json
{
  "react": "^18.x",
  "axios": "^1.x",
  "bootstrap": "^5.x",
  "animate.css": "^4.x"
}
```

### **Backend:**
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "axios": "^1.x",
  "uuid": "^9.0.0"
}
```

## 🎯 Valor y Diferenciación

### **Innovación:**
- Primer simulador que combina datos reales con gamificación
- Sistema de certificación LEO propietario
- Integración directa con APIs espaciales públicas

### **Realismo:**
- Datos de proveedores satelitales reales
- Métricas basadas en información pública
- Simulación de procesos empresariales reales

### **Escalabilidad:**
- Arquitectura modular
- APIs RESTful estándar
- Código limpio y documentado

## 🏆 Logros Técnicos

✅ **Integración exitosa** con APIs externas de datos satelitales  
✅ **Sistema de filtrado avanzado** con múltiples criterios  
✅ **UI/UX profesional** con animaciones y responsive design  
✅ **Manejo robusto de errores** y fallbacks  
✅ **Arquitectura escalable** frontend/backend  
✅ **Datos reales** de 6 empresas espaciales principales  

---

## 💡 Presentación Ejecutiva

**LEO Space Platform** representa la convergencia entre tecnología web moderna y el creciente sector espacial comercial. A través de una interfaz intuitiva y datos reales, la plataforma demuestra competencias técnicas avanzadas en:

- **Desarrollo Full-Stack** con tecnologías modernas
- **Integración de APIs** y manejo de datos externos
- **UI/UX Design** profesional y responsive
- **Arquitectura de Software** escalable y mantenible
- **Gestión de Estado** complejo en aplicaciones web

El proyecto simula un marketplace real de datos satelitales, proporcionando una experiencia que podría implementarse en el sector espacial comercial actual.