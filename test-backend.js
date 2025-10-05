// Test simple del backend
const axios = require('axios');

async function testBackend() {
  try {
    console.log('Testing backend API...');
    
    // Test de inicio de juego
    const response = await axios.post('http://localhost:9002/api/game/start', {
      scenario: 'operator',
      budget: 100000,
      satellitesCount: 4
    });
    
    console.log('✅ Backend response:', response.status);
    console.log('Game ID:', response.data.id);
    console.log('Budget:', response.data.budget);
    console.log('Satellites:', response.data.satellites.length);
    
    return response.data;
  } catch (error) {
    console.error('❌ Backend error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testBackend();