# 🚀 LEO Decisions

**Simulador Interactivo de Decisiones en Órbita Terrestre Baja**

Un juego educativo desarrollado para el **NASA Space Apps Challenge 2025** que demuestra los trade-offs entre beneficios económicos, sostenibilidad ambiental y gestión de riesgos en la comercialización del espacio LEO.

## 🎯 ¿Qué es LEO Decisions?

Es una herramienta interactiva que pone a los usuarios en el rol de tomadores de decisiones espaciales:

- **Operadores Satelitales**: Gestionan constelaciones, deciden retiros y maniobras
- **Inmobiliarias**: Monitorean terrenos usando datos satelitales
- **ONGs Ambientales**: Protegen bosques amazónicos de la deforestación

Cada decisión tiene consecuencias reales en términos de costos, riesgos de colisión y score ESG (Environmental, Social, Governance).

## 🎮 Cómo Jugar

### Inicio Rápido (Windows)
```cmd
# Doble clic en start.bat o ejecuta:
start.bat
```

### Inicio Manual
```bash
# Backend
cd server && npm install && npm run dev

# Frontend (nueva terminal)
cd client && npm install && npm run dev
```

Abre http://localhost:5173 y selecciona un escenario.

### 🎯 NUEVAS FEATURES

#### 📊 Visualizaciones Mejoradas
- **Mapas Interactivos**: Satélites con círculos de riesgo, popups informativos
- **Gráficos NDVI**: Evolución en tiempo real de la vegetación
- **Eventos en Vivo**: Log de eventos con colores por tipo
- **KPIs Contextuales**: Métricas específicas por escenario

#### 🎓 Tutorial Interactivo
- **Modal de Tutorial**: Explicación completa de conceptos
- **Ejemplos Prácticos**: Casos reales con números concretos
- **Consejos Contextuales**: Ayuda integrada en cada pantalla

#### 📈 Escenarios Enriquecidos
- **Inmobiliaria**: Valor de propiedad, pérdidas por deforestación
- **ONG**: Créditos de carbono, biodiversidad
- **Operador**: Gestión de riesgos, costos operativos

#### 🏆 Sistema de Calificación
- **Evaluación Final**: Calificación automática del desempeño
- **Recomendaciones**: Sugerencias basadas en decisiones tomadas
- **Reportes PDF**: Análisis ejecutivo completo

### Reglas del Juego

1. **6 Turnos**: Toma decisiones estratégicas durante 6 periodos
2. **Acciones Disponibles**:
   - **EOL (End of Life)**: Retiro planificado (+10 ESG, reduce riesgo)
   - **Group Maneuver**: Maniobra conjunta (ahorra costos)
   - **Monitoring**: Datos adicionales (+5 ESG si previene problemas)
   - **No Action**: Riesgo aumenta gradualmente

3. **KPIs a Optimizar**:
   - **Presupuesto**: Mantén fondos para emergencias
   - **Score ESG**: Medida de sostenibilidad
   - **Colisiones**: Evítalas a toda costa
   - **Δv Total**: Eficiencia energética

4. **Eventos Aleatorios**: Colisiones pueden ocurrir basadas en riesgo

### Ejemplo de Estrategia

**Escenario: Operador Satelital**
- Satélite SAT-1: Riesgo 35%, edad 3 años
- **Decisión**: EOL cuesta $1,050 pero reduce riesgo a 2%
- **Alternativa**: No hacer nada → riesgo aumenta → posible colisión ($22,000)

## 🏗️ Arquitectura

### Frontend (React + Vite)
- **UI Moderna**: Bootstrap + componentes personalizados
- **Visualización**: Leaflet maps, Chart.js para NDVI
- **Interactividad**: Tutorial, tooltips, feedback visual

### Backend (Node.js + Express)
- **Game Engine**: Lógica completa de simulación
- **API REST**: Endpoints para juego, turnos, reportes
- **Persistencia**: JSON files (fácil despliegue)

### Algoritmos Implementados
- **Cálculo de Riesgo**: Basado en edad, altitud, acciones previas
- **Probabilidad de Colisión**: Sistema de eventos aleatorios
- **Costos Dinámicos**: Δv, masa, factores de sharing
- **Score ESG**: Métricas de sostenibilidad

## 📊 Escenarios Detallados

### 🛰️ Operador Satelital
**Objetivo**: Gestionar 4 satélites con presupuesto $50,000
- **Desafío**: Balancear retiros costosos vs riesgos de colisión
- **Éxito**: Máximo ESG con mínimo colisiones

### 🏠 Inmobiliaria
**Objetivo**: Monitorear terrenos agrícolas
- **Métrica**: NDVI (índice de vegetación)
- **Desafío**: Detectar deforestación temprana
- **Éxito**: Prevenir pérdidas económicas

### 🌳 ONG Ambiental
**Objetivo**: Proteger bosques amazónicos
- **Presupuesto**: $30,000 (limitado)
- **Métrica**: NDVI de bosques
- **Éxito**: Máximo impacto ambiental

## 🚀 Despliegue

### Desarrollo Local
```bash
# Instalar dependencias
npm install  # en server/
npm install  # en client/

# Ejecutar
npm run dev  # server
npm run dev  # client
```

### Producción
- **Frontend**: Vercel/Netlify
- **Backend**: Render/Railway
- **Base de datos**: SQLite/PostgreSQL (opcional)

## 📈 Resultados Esperados

Al finalizar el juego, obtienes:
- **Reporte PDF**: Resumen ejecutivo con KPIs
- **Análisis**: Trade-offs de tus decisiones
- **Recomendaciones**: Para escenarios reales

## 🎓 Valor Educativo

Este proyecto demuestra conceptos reales de:
- **Economía Espacial**: Costos de lanzamiento vs operación
- **Sostenibilidad**: Gestión de basura espacial
- **Tecnología**: Satélites, órbitas, sensores
- **Regulación**: Normativas internacionales

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Desarrollado para NASA Space Apps Challenge 2025.
Basado en conceptos de comercialización LEO.

---

**¡Experimenta los desafíos reales de comercializar el espacio!** 🌌