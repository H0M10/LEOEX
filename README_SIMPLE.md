# LEO Operations Simulator - Juego Automático

## Descripción
Simulador simplificado de operaciones de satélites en órbita baja terrestre (LEO) con configuración automática y juego inmediato.

## Características
- ✅ **Juego Automático**: Inicia con presupuesto y configuración predeterminados
- ✅ **Sin Configuración Manual**: No requiere selección de presupuesto ni configuración inicial
- ✅ **Mecánicas Simplificadas**: Enfoque en las operaciones core de satélites
- ✅ **4 Satélites Pre-configurados**: Listos para operar desde el inicio
- ✅ **Presupuesto Fijo**: $100,000 automáticamente asignados
- ✅ **Tareas Generadas**: Sistema automático de generación de misiones

## Estructura del Proyecto

```
Juego/
├── server_new/           # Servidor backend simplificado
│   ├── index.js         # Servidor Express
│   ├── gameEngine.js    # Motor de juego limpio y minimal
│   └── games/           # Estados de juego guardados
└── client/              # Cliente React simplificado
    ├── src/
    │   ├── App.jsx      # Aplicación principal
    │   └── SimpleGame.jsx # Componente del juego
    └── package.json
```

## Cómo Ejecutar

### 1. Servidor (Backend)
```bash
cd server_new
npm install
npm run dev
```
El servidor estará disponible en: http://localhost:9002

### 2. Cliente (Frontend)
```bash
cd client
npm install
npm run dev
```
El cliente estará disponible en: http://localhost:5173

## Mecánicas del Juego

### Satélites
- **Estado**: active/failed
- **Combustible**: 0-100%
- **Riesgo de Colisión**: 0-100%
- **Eficiencia**: Afecta las recompensas de tareas

### Acciones Disponibles
- **Recargar**: Restaura combustible a 100% ($2,000)
- **Evasión (CAM)**: Reduce riesgo de colisión ($2,500, -8% combustible)
- **Imágenes**: Captura de datos ($800, -2% combustible)
- **Mantenimiento**: Mejora eficiencia ($1,200)

### Sistema de Tareas
- **Generación Automática**: 1 tarea nueva por turno
- **Tipos de Tareas**:
  - Evitar Colisión (penalización: -$15,000)
  - Imágenes Comerciales (recompensa: +$12,000)
  - Monitoreo ONG (recompensa: +$8,000)
  - Red IoT (recompensa: +$4,200)
  - Mantenimiento (penalización: -$8,000)

### Condiciones de Victoria/Derrota
- **Objetivo**: Maximizar presupuesto en 12 turnos
- **Penalizaciones**: Tareas vencidas y colisiones
- **Costos Operacionales**: $3,000 por turno

## Archivos Eliminados
Se han removido los siguientes archivos para simplificar:
- `server/` (servidor duplicado)
- Componentes React duplicados (`EnhancedGameBoard_*.jsx`)
- Archivos de juego previos (`.json` en `games/`)
- Configuraciones complejas de presupuesto

## Tecnologías
- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Estado**: Archivos JSON locales
- **Comunicación**: REST API + Axios

## API Endpoints

- `POST /api/game/start` - Iniciar nuevo juego
- `POST /api/game/:id/step` - Ejecutar acción en el juego
- `GET /api/game/:id` - Obtener estado actual del juego

## Notas de Desarrollo

El proyecto fue simplificado para eliminar:
- Selección manual de presupuesto
- Configuraciones complejas
- Múltiples modos de juego
- Servicios y upgrades avanzados
- Tutoriales extensos

Ahora es un juego **plug-and-play** que inicia automáticamente con todas las configuraciones necesarias.