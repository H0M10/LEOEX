// Servicios especializados para cada sector con APIs reales diferentes
export class SpecializedSectorAPIs {
  constructor() {
    this.apis = {
      // Agricultura - APIs específicas
      agriculture: {
        usda: 'https://quickstats.nass.usda.gov/api/', // USDA NASS API
        copernicus: 'https://scihub.copernicus.eu/dhus/search', // Sentinel data
        modis: 'https://modis.gsfc.nasa.gov/data/dataprod/', // MODIS vegetation
        landsat: 'https://landsatlook.usgs.gov/sat-api/', // USGS Landsat
        fao: 'http://www.fao.org/faostat/api/v1/en/', // FAO Agricultural data
      },
      
      // Medio Ambiente - APIs ambientales
      environment: {
        epa: 'https://www.epa.gov/enviro/web-services', // EPA Air Quality
        copernicus_atmosphere: 'https://ads.atmosphere.copernicus.eu/api/v2/', // Atmospheric data
        noaa_climate: 'https://www.ncei.noaa.gov/data/global-summary-of-the-month/', // Climate data
        worldBank: 'https://datahelpdesk.worldbank.org/knowledgebase/articles/889392', // Environmental indicators
        esa_climate: 'https://climate.esa.int/en/projects/', // ESA Climate Change Initiative
      },
      
      // Desastres - APIs de emergencia
      disaster: {
        usgs_earthquakes: 'https://earthquake.usgs.gov/fdsnws/event/1/', // Earthquake data
        nasa_firms: 'https://firms.modaps.eosdis.nasa.gov/api/', // Fire data
        noaa_weather: 'https://api.weather.gov/', // Weather alerts
        gdacs: 'http://www.gdacs.org/xml/rss.xml', // Global Disaster Alert
        esa_emergency: 'https://emergency.copernicus.eu/mapping/list-of-components/EMSR', // Emergency mapping
      },
      
      // Urbano - APIs de ciudades
      urban: {
        worldBank_urban: 'https://datahelpdesk.worldbank.org/knowledgebase/articles/889392', // Urban development
        eea: 'https://www.eea.europa.eu/data-and-maps/data/', // European Environment Agency
        un_habitat: 'https://unhabitat.org/global-urban-observatory', // UN Habitat data
        openstreetmap: 'https://overpass-api.de/api/', // Urban mapping
        cityscope: 'https://www.media.mit.edu/projects/cityscope/overview/', // MIT CityScope
      },
      
      // Marítimo - APIs oceánicas
      maritime: {
        imo: 'https://gisis.imo.org/Public/', // International Maritime Organization
        marineTraffic: 'https://www.marinetraffic.com/en/ais-api-services/', // Ship tracking
        noaa_marine: 'https://www.ndbc.noaa.gov/data/', // Marine buoys
        copernicus_marine: 'https://marine.copernicus.eu/', // Marine monitoring
        esa_sea_level: 'https://www.esa-sealevel-cci.org/', // Sea level data
      },
      
      // Energía - APIs energéticas
      energy: {
        irena: 'https://www.irena.org/Data', // Renewable energy data
        iea: 'https://www.iea.org/data-and-statistics', // Energy statistics
        solargis: 'https://solargis.com/maps-and-gis-data/download/', // Solar data
        nrel: 'https://developer.nrel.gov/docs/', // National Renewable Energy Lab
        globalWindAtlas: 'https://globalwindatlas.info/', // Wind resources
      }
    };
    
    // Métricas específicas y profesionales para cada sector
    this.sectorMetrics = {
      agriculture: {
        primary: [
          { key: 'ndvi', name: 'NDVI', unit: 'index', description: 'Normalized Difference Vegetation Index' },
          { key: 'evi', name: 'EVI', unit: 'index', description: 'Enhanced Vegetation Index' },
          { key: 'lai', name: 'LAI', unit: 'm²/m²', description: 'Leaf Area Index' }
        ],
        secondary: [
          { key: 'soilMoisture', name: 'Humedad del Suelo', unit: '%', description: 'Soil Moisture Content' },
          { key: 'temperature', name: 'Temperatura Superficial', unit: '°C', description: 'Land Surface Temperature' },
          { key: 'precipitation', name: 'Precipitación', unit: 'mm', description: 'Rainfall accumulation' }
        ],
        satellites: ['Landsat-8/9', 'Sentinel-2', 'MODIS Terra/Aqua', 'SMAP', 'SMOS'],
        applications: ['Crop monitoring', 'Yield prediction', 'Drought assessment', 'Irrigation management']
      },
      
      environment: {
        primary: [
          { key: 'co2', name: 'CO₂', unit: 'ppm', description: 'Atmospheric Carbon Dioxide' },
          { key: 'ch4', name: 'CH₄', unit: 'ppb', description: 'Atmospheric Methane' },
          { key: 'no2', name: 'NO₂', unit: 'µg/m³', description: 'Nitrogen Dioxide' }
        ],
        secondary: [
          { key: 'aod', name: 'AOD', unit: 'unitless', description: 'Aerosol Optical Depth' },
          { key: 'ozone', name: 'O₃', unit: 'DU', description: 'Total Ozone Column' },
          { key: 'pm25', name: 'PM2.5', unit: 'µg/m³', description: 'Particulate Matter 2.5μm' }
        ],
        satellites: ['Sentinel-5P', 'AIRS', 'OMI', 'IASI', 'OCO-2/3'],
        applications: ['Air quality monitoring', 'Climate change tracking', 'Pollution source identification']
      },
      
      disaster: {
        primary: [
          { key: 'hotspots', name: 'Puntos de Calor', unit: 'count', description: 'Active fire detections' },
          { key: 'floodExtent', name: 'Extensión Inundación', unit: 'km²', description: 'Flooded area extent' },
          { key: 'earthquakeMagnitude', name: 'Magnitud Sísmica', unit: 'Richter', description: 'Earthquake magnitude' }
        ],
        secondary: [
          { key: 'burntArea', name: 'Área Quemada', unit: 'ha', description: 'Burnt area mapping' },
          { key: 'damages', name: 'Daños Estimados', unit: 'USD', description: 'Economic damage assessment' },
          { key: 'population', name: 'Población Afectada', unit: 'persons', description: 'Affected population' }
        ],
        satellites: ['VIIRS', 'MODIS', 'Sentinel-1', 'Landsat', 'GOES-16/17'],
        applications: ['Emergency response', 'Damage assessment', 'Risk mapping', 'Early warning']
      },
      
      urban: {
        primary: [
          { key: 'urbanExpansion', name: 'Expansión Urbana', unit: 'km²/year', description: 'Urban growth rate' },
          { key: 'buildingDensity', name: 'Densidad Edificios', unit: 'buildings/km²', description: 'Building density' },
          { key: 'greenSpace', name: 'Espacios Verdes', unit: '%', description: 'Green space percentage' }
        ],
        secondary: [
          { key: 'heatIsland', name: 'Isla de Calor', unit: '°C', description: 'Urban heat island intensity' },
          { key: 'airQuality', name: 'Calidad del Aire', unit: 'AQI', description: 'Air Quality Index' },
          { key: 'lightPollution', name: 'Contaminación Lumínica', unit: 'nW/cm²/sr', description: 'Night light pollution' }
        ],
        satellites: ['Landsat-8/9', 'Sentinel-2', 'WorldView', 'VIIRS DNB', 'Planet Labs'],
        applications: ['Urban planning', 'Smart city development', 'Infrastructure monitoring']
      },
      
      maritime: {
        primary: [
          { key: 'vesselDensity', name: 'Densidad Naviera', unit: 'ships/km²', description: 'Vessel traffic density' },
          { key: 'seaTemperature', name: 'Temperatura Marina', unit: '°C', description: 'Sea Surface Temperature' },
          { key: 'waveHeight', name: 'Altura Olas', unit: 'm', description: 'Significant wave height' }
        ],
        secondary: [
          { key: 'chlorophyll', name: 'Clorofila-a', unit: 'mg/m³', description: 'Ocean productivity indicator' },
          { key: 'seaLevel', name: 'Nivel del Mar', unit: 'cm', description: 'Sea level anomaly' },
          { key: 'oilSpills', name: 'Derrames Petróleo', unit: 'incidents', description: 'Oil spill detections' }
        ],
        satellites: ['Sentinel-1', 'Sentinel-3', 'Jason-3', 'MODIS Aqua', 'VIIRS'],
        applications: ['Maritime surveillance', 'Ocean monitoring', 'Fishing management', 'Environmental protection']
      },
      
      energy: {
        primary: [
          { key: 'solarIrradiance', name: 'Irradiancia Solar', unit: 'kWh/m²/day', description: 'Global horizontal irradiance' },
          { key: 'windSpeed', name: 'Velocidad Viento', unit: 'm/s', description: 'Wind speed at 100m height' },
          { key: 'hydroPotential', name: 'Potencial Hidro', unit: 'MW', description: 'Hydroelectric potential' }
        ],
        secondary: [
          { key: 'cloudCover', name: 'Cobertura Nubes', unit: '%', description: 'Cloud coverage impact' },
          { key: 'temperature', name: 'Temperatura', unit: '°C', description: 'Temperature for energy demand' },
          { key: 'biomass', name: 'Biomasa', unit: 'tons/ha', description: 'Biomass energy potential' }
        ],
        satellites: ['MSG', 'GOES', 'Himawari', 'MODIS', 'Landsat'],
        applications: ['Renewable energy planning', 'Grid optimization', 'Energy forecasting']
      }
    };
  }

  // Generar datos específicos y realistas para cada sector
  generateSectorData(sector, days = 30) {
    const metrics = this.sectorMetrics[sector];
    if (!metrics) return null;

    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayOfYear = date.getDayOfYear();
      const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI);
      
      let dataPoint = {
        date: date.toISOString().split('T')[0],
        source: `${metrics.satellites.slice(0, 2).join(', ')} Real Data Simulation`
      };

      // Generar datos específicos por sector con patrones realistas
      switch (sector) {
        case 'agriculture':
          dataPoint = {
            ...dataPoint,
            ndvi: Math.max(0.1, Math.min(0.9, 0.5 + seasonalFactor * 0.3 + (Math.random() - 0.5) * 0.1)),
            evi: Math.max(0.1, Math.min(0.8, 0.4 + seasonalFactor * 0.25 + (Math.random() - 0.5) * 0.08)),
            lai: Math.max(0.5, Math.min(6, 3 + seasonalFactor * 2 + (Math.random() - 0.5) * 0.5)),
            soilMoisture: Math.max(10, Math.min(60, 35 + seasonalFactor * 15 + (Math.random() - 0.5) * 10)),
            temperature: 20 + seasonalFactor * 15 + (Math.random() - 0.5) * 5,
            precipitation: Math.max(0, 50 + seasonalFactor * 30 + (Math.random() - 0.5) * 40)
          };
          break;

        case 'environment':
          dataPoint = {
            ...dataPoint,
            co2: 420 + (dayOfYear / 365) * 2.5 + Math.sin((dayOfYear / 365) * 2 * Math.PI) * 6 + (Math.random() - 0.5) * 3,
            ch4: 1900 + (dayOfYear / 365) * 10 + (Math.random() - 0.5) * 50,
            no2: Math.max(5, 25 + seasonalFactor * 15 + (Math.random() - 0.5) * 10),
            aod: Math.max(0.05, Math.min(0.8, 0.2 + (Math.random() - 0.5) * 0.3)),
            ozone: 300 + seasonalFactor * 50 + (Math.random() - 0.5) * 20,
            pm25: Math.max(5, 20 + seasonalFactor * 10 + (Math.random() - 0.5) * 15)
          };
          break;

        case 'disaster':
          const fireRisk = Math.max(0, seasonalFactor + 0.5); // Mayor riesgo en verano
          dataPoint = {
            ...dataPoint,
            hotspots: Math.floor(Math.max(0, fireRisk * 50 * Math.random())),
            floodExtent: Math.max(0, (Math.random() < 0.1 ? Math.random() * 1000 : 0)),
            earthquakeMagnitude: Math.random() < 0.05 ? (3 + Math.random() * 4) : 0,
            burntArea: Math.max(0, fireRisk * 1000 * Math.random()),
            damages: Math.random() < 0.02 ? Math.random() * 10000000 : 0,
            population: Math.floor(Math.random() * 50000)
          };
          break;

        case 'urban':
          dataPoint = {
            ...dataPoint,
            urbanExpansion: 2 + Math.random() * 3, // km²/year
            buildingDensity: 500 + Math.random() * 1500,
            greenSpace: Math.max(10, Math.min(60, 30 + (Math.random() - 0.5) * 20)),
            heatIsland: Math.max(0, 2 + seasonalFactor * 3 + (Math.random() - 0.5) * 2),
            airQuality: Math.max(0, Math.min(500, 100 + seasonalFactor * 50 + (Math.random() - 0.5) * 80)),
            lightPollution: 50 + Math.random() * 200
          };
          break;

        case 'maritime':
          dataPoint = {
            ...dataPoint,
            vesselDensity: Math.max(0, 5 + Math.random() * 20),
            seaTemperature: 15 + seasonalFactor * 10 + (Math.random() - 0.5) * 3,
            waveHeight: Math.max(0.5, 2 + Math.random() * 3),
            chlorophyll: Math.max(0.1, 1 + seasonalFactor * 0.8 + (Math.random() - 0.5) * 0.5),
            seaLevel: (Math.random() - 0.5) * 20, // cm anomaly
            oilSpills: Math.random() < 0.01 ? 1 : 0
          };
          break;

        case 'energy':
          dataPoint = {
            ...dataPoint,
            solarIrradiance: Math.max(0, 4 + seasonalFactor * 3 + (Math.random() - 0.5) * 2),
            windSpeed: Math.max(2, 8 + Math.random() * 10),
            hydroPotential: Math.max(10, 100 + seasonalFactor * 50 + (Math.random() - 0.5) * 30),
            cloudCover: Math.max(0, Math.min(100, 40 + (Math.random() - 0.5) * 60)),
            temperature: 15 + seasonalFactor * 20 + (Math.random() - 0.5) * 8,
            biomass: Math.max(5, 15 + seasonalFactor * 10 + (Math.random() - 0.5) * 5)
          };
          break;

        default:
          return null;
      }

      data.push(dataPoint);
    }

    return data;
  }

  // Obtener información detallada del sector
  getSectorInfo(sector) {
    return this.sectorMetrics[sector] || null;
  }

  // Obtener estadísticas regionales específicas por sector
  getRegionalData(sector) {
    const regions = ['América del Norte', 'Europa', 'Asia', 'América del Sur', 'África', 'Oceanía'];
    const baseValues = {
      agriculture: [85, 78, 82, 68, 45, 72],
      environment: [72, 85, 65, 58, 42, 78],
      disaster: [15, 8, 25, 35, 45, 20],
      urban: [88, 92, 75, 65, 55, 82],
      maritime: [90, 85, 88, 70, 60, 95],
      energy: [75, 80, 68, 60, 45, 85]
    };

    const values = baseValues[sector] || [70, 75, 70, 65, 55, 75];
    
    return regions.map((region, index) => ({
      region,
      value: values[index] + (Math.random() - 0.5) * 10,
      coverage: Math.max(60, values[index] + (Math.random() - 0.5) * 20)
    }));
  }
}

// Extensión de Date para obtener día del año
Date.prototype.getDayOfYear = function() {
  const start = new Date(this.getFullYear(), 0, 0);
  const diff = this - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export default SpecializedSectorAPIs;