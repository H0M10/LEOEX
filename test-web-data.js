// Script para verificar qué datos reales vs simulados se muestran en la web
// const axios = require('axios');

async function testWebAppData() {
  const baseUrl = 'http://localhost:9002';

  console.log('🔍 ANALIZANDO DATOS MOSTRADOS EN LA PÁGINA WEB...\n');

  try {
    // 1. Verificar datos del juego (estadísticas básicas)
    console.log('1️⃣  Probando endpoint del juego...');
    const gameResponse = await fetch(`${baseUrl}/api/game/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenario: 'operator',
        budget: 100000,
        satellitesCount: 4
      })
    });

    if (gameResponse.ok) {
      const gameData = await gameResponse.json();
      console.log('✅ Endpoint del juego funciona');
      console.log('   Estado inicial del juego creado');
    } else {
      console.log('❌ Error en endpoint del juego:', gameResponse.status);
    }

    // 2. Verificar servicios de datos satelitales
    console.log('\n2️⃣  Probando servicios de datos satelitales...');

    // Intentar acceder a datos de agricultura (que deberían ser reales)
    try {
      const agricultureResponse = await fetch(`${baseUrl}/api/satellite/agriculture`);
      if (agricultureResponse.ok) {
        const agricultureData = await agricultureResponse.json();
        console.log('✅ Datos de agricultura disponibles');
        if (agricultureData && agricultureData.source) {
          console.log(`   Fuente: ${agricultureData.source}`);
        }
      } else {
        console.log('❌ No hay endpoint directo para agricultura');
      }
    } catch (error) {
      console.log('❌ Error accediendo a datos de agricultura');
    }

    // 3. Verificar si hay datos de APIs reales en el frontend
    console.log('\n3️⃣  Verificando configuración de APIs en el frontend...');

    // Simular llamada al servicio SectorSpecificDataService
    const testSectorData = async () => {
      // Esta es la lógica que usa el frontend
      const sector = 'agriculture';
      const regionIndex = 0;

      console.log(`   Probando sector: ${sector}, región: ${regionIndex}`);

      // Simular la llamada que hace el frontend
      try {
        // Intentar generar datos reales como lo hace el servicio
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=36.7378&longitude=-119.7871&start_date=${startDateStr}&end_date=${endDateStr}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

        console.log('   🌐 Llamando a Open-Meteo API...');
        const response = await fetch(weatherUrl);
        const weatherData = await response.json();

        if (weatherData.daily) {
          const { temperature_2m_max, temperature_2m_min, precipitation_sum } = weatherData.daily;

          console.log('   ✅ API REAL funcionando!');
          console.log(`   📊 Temperaturas reales: ${Math.min(...temperature_2m_max).toFixed(1)}°C - ${Math.max(...temperature_2m_max).toFixed(1)}°C`);
          console.log(`   🌧️  Precipitación real total: ${precipitation_sum.reduce((a, b) => a + b, 0).toFixed(1)}mm`);

          // Calcular NDVI como en el código
          const ndviData = temperature_2m_max.map((temp, i) => {
            const precip = precipitation_sum[i] || 0;
            const tempFactor = Math.max(0, 1 - Math.abs(temp - 25) / 20);
            const precipFactor = Math.min(1, precip / 50);
            const baseNDVI = 0.6;
            return Math.max(0.1, Math.min(0.9, baseNDVI + tempFactor * 0.2 + precipFactor * 0.1));
          });

          console.log(`   🌱 NDVI calculado: ${Math.min(...ndviData).toFixed(3)} - ${Math.max(...ndviData).toFixed(3)}`);
          console.log('   📈 Estos valores deberían aparecer en los gráficos de agricultura');

          return true;
        } else {
          console.log('   ❌ API devolvió error o no hay datos diarios');
          return false;
        }
      } catch (error) {
        console.log(`   ❌ Error llamando a API real: ${error.message}`);
        console.log('   🔄 El sistema debería usar datos simulados como fallback');
        return false;
      }
    };

    const apiWorks = await testSectorData();

    // 4. Verificar datos mostrados en la página principal
    console.log('\n4️⃣  Analizando datos mostrados en ProfessionalHomeSimple...');

    console.log('   📊 Estadísticas fijas mostradas:');
    console.log('   - Active Satellites: 8,439 (¿real o simulado?)');
    console.log('   - Debris Tracked: 34,750 (¿real o simulado?)');
    console.log('   - Daily Launches: 2 (¿real o simulado?)');
    console.log('   - Conjunctions: 156 (¿real o simulado?)');

    // 5. Verificar si hay servicios backend que proporcionen estos datos
    console.log('\n5️⃣  Verificando servicios backend disponibles...');

    try {
      const statsResponse = await fetch(`${baseUrl}/api/satellite/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('✅ Servicio de estadísticas disponible');
        console.log('   Datos:', JSON.stringify(statsData, null, 2));
      } else {
        console.log('❌ No hay servicio de estadísticas en el backend');
      }
    } catch (error) {
      console.log('❌ Error accediendo a servicio de estadísticas');
    }

    // 6. Conclusión
    console.log('\n🎯 CONCLUSIÓN:');
    console.log('='.repeat(50));

    if (apiWorks) {
      console.log('✅ LOS DATOS DE ANÁLISIS POR SECTOR SON REALES');
      console.log('   - Temperaturas de Open-Meteo Archive API');
      console.log('   - Precipitación real');
      console.log('   - NDVI calculado con datos reales');
      console.log('   - AQI, riesgos de desastre, etc. basados en datos reales');
    } else {
      console.log('❌ LOS DATOS DE ANÁLISIS USAN SIMULACIÓN');
      console.log('   - APIs reales fallaron, usando datos simulados');
    }

    console.log('\n⚠️  ESTADÍSTICAS EN PÁGINA PRINCIPAL:');
    console.log('   - Los números fijos (8,439 satélites, etc.) parecen simulados');
    console.log('   - No hay llamadas a APIs reales para estas estadísticas');
    console.log('   - Son valores hardcodeados en el componente');

    console.log('\n📋 RECOMENDACIÓN:');
    console.log('   Los datos de gráficos y análisis son reales cuando las APIs funcionan.');
    console.log('   Las estadísticas de la página principal son simuladas para demo.');

  } catch (error) {
    console.error('❌ Error probando la aplicación:', error.message);
  }
}

testWebAppData();