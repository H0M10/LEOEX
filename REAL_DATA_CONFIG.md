# Configuración de APIs Satelitales Reales

## APIs Gratuitas Disponibles

### 1. NASA API (Limitada con DEMO_KEY)
- **Registro:** https://api.nasa.gov/
- **Límites con DEMO_KEY:** 30 requests/hora, 50 requests/día
- **Límites con API key:** 1,000 requests/hora
- **Datasets disponibles:**
  - Earth Imagery API: Imágenes satelitales de Landsat 8
  - MODIS: Datos de vegetación y temperatura
  - EONET: Eventos naturales en tiempo real

**Configuración:**
```javascript
// En RealSatelliteDataService.js
apiKeys: {
  nasa: 'TU_NASA_API_KEY_AQUI' // Reemplazar DEMO_KEY
}
```

### 2. N2YO - Satellite Tracking
- **Registro:** https://www.n2yo.com/api/
- **Precio:** Gratuito hasta 1,000 requests/día
- **Datos:** Posición en tiempo real de satélites LEO
- **Funcionalidades:**
  - Satélites sobre una ubicación
  - Predicciones de pases
  - Información orbital

**Configuración:**
```javascript
apiKeys: {
  n2yo: 'TU_N2YO_API_KEY_AQUI'
}
```

### 3. OpenWeatherMap
- **Registro:** https://openweathermap.org/api
- **Precio:** Gratuito hasta 1,000 calls/día
- **Datos satelitales:**
  - Mapas meteorológicos
  - Datos de temperatura y humedad
  - Cobertura de nubes (desde satélites)

**Configuración:**
```javascript
apiKeys: {
  openWeather: 'TU_OPENWEATHER_API_KEY_AQUI'
}
```

### 4. NOAA (Sin API Key requerida)
- **Acceso:** Directo, sin registro
- **Datos:** Clima, océanos, alertas meteorológicas
- **Limitaciones:** Algunos endpoints requieren registro

### 5. ESA Copernicus (Acceso público limitado)
- **Acceso:** Algunos datos públicos sin API key
- **Registro completo:** https://scihub.copernicus.eu/
- **Datos:** Sentinel-1, Sentinel-2, Sentinel-3

## Cómo Configurar las API Keys

### Opción 1: Archivo de entorno (Recomendado)
Crear archivo `.env` en la raíz del proyecto client:

```env
VITE_NASA_API_KEY=tu_nasa_api_key
VITE_N2YO_API_KEY=tu_n2yo_api_key
VITE_OPENWEATHER_API_KEY=tu_openweather_api_key
```

### Opción 2: Configuración directa (Solo para desarrollo)
Modificar `RealSatelliteDataService.js`:

```javascript
this.apiKeys = {
  nasa: 'tu_nasa_api_key_aqui',
  n2yo: 'tu_n2yo_api_key_aqui',
  openWeather: 'tu_openweather_api_key_aqui',
};
```

## Datos Actualmente Reales vs Simulados

### ✅ Datos Reales (Basados en fuentes oficiales)
- **Estadísticas de satélites:** UCS Satellite Database, Space-Track.org
- **Número de debris:** ESA Space Debris Office
- **Conteo de satélites LEO:** Datos actualizados de organizaciones espaciales

### ⚠️ Datos Simulados (Pero basados en patrones reales)
- **Series temporales de NDVI:** Patrones estacionales realistas
- **Datos de CO2:** Basados en tendencias de Mauna Loa Observatory
- **Temperatura oceánica:** Ciclos estacionales típicos

### 🔄 Datos que se vuelven reales con API keys
- **Imágenes satelitales:** NASA Earth API
- **Posiciones de satélites:** N2YO tracking en vivo
- **Datos meteorológicos:** OpenWeatherMap desde satélites

## Fuentes de Datos Oficiales Utilizadas

1. **UCS Satellite Database** - Conteo de satélites activos
2. **Space-Track.org** - Objetos espaciales rastreados
3. **ESA Space Debris Office** - Estadísticas de debris espacial
4. **NASA MODIS** - Datos de vegetación y temperatura
5. **NOAA** - Datos climáticos y oceánicos
6. **Copernicus Programme** - Datos de Sentinel

## Próximos Pasos para Datos 100% Reales

1. **Registrarse en las APIs gratuitas** (5-10 minutos cada una)
2. **Configurar las API keys** en el archivo `.env`
3. **Activar modo de desarrollo con APIs reales**
4. **Para producción:** Considerar APIs premium para límites más altos

## Limitaciones Actuales

- **Sin API keys:** Mezcla de datos reales (estadísticas) y simulados (series temporales)
- **Con API keys gratuitas:** ~90% datos reales, algunas limitaciones de frecuencia
- **APIs premium:** 100% datos reales en tiempo real sin limitaciones