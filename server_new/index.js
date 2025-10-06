
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createInitialState, stepTurn, evaluateGameStatus, getStrategicTips } = require('./gameEngine');
const { getNasaSatellites } = require('./nasaProviders');

const app = express();
app.use(cors({
  origin: ['https://h0m10.github.io', 'https://H0M10.github.io']
}));
app.use(bodyParser.json());

// --- API de proveedores reales (NASA y aliados) ---
app.get('/api/providers/reales', async (req, res) => {
  console.log('=== Llamada a /api/providers/reales ===');
  try {
    const data = await getNasaSatellites();
    console.log('=== Datos recibidos de getNasaSatellites ===');
    console.log('Tipo:', typeof data);
    console.log('Es array:', Array.isArray(data));
    console.log('Longitud:', Array.isArray(data) ? data.length : 'N/A');
    console.log('Primer elemento:', Array.isArray(data) && data.length > 0 ? data[0] : 'ninguno');
    console.log('=== Enviando respuesta ===');
    res.json(data || []);
  } catch (err) {
    console.error('Error en /api/providers/reales:', err);
    res.status(500).json({ error: 'Error al obtener proveedores reales', details: err.message });
  }
});

const GAMES_DIR = path.join(__dirname, 'games');
if (!fs.existsSync(GAMES_DIR)) fs.mkdirSync(GAMES_DIR);

app.use((req,res,next)=>{ console.log(new Date().toISOString(), req.method, req.url); next(); });

app.get('/', (req,res) => res.json({ ok: true }));
app.get('/health', (req,res) => res.json({ status: 'ok', ts: Date.now() }));

// Endpoint de prueba directo
app.get('/api/test', (req, res) => {
  console.log('=== Test endpoint llamado ===');
  res.json({ 
    test: true, 
    timestamp: new Date().toISOString(),
    providers: [
      { id: 1, name: 'Test Provider', country: 'Test', services: ['Test'], reputation: 5, sustainability: 100, shared: true, price: 1000, trend: 'up' }
    ]
  });
});

app.post('/api/game/start', (req,res) => {
  if (!req.body || !req.body.scenario) return res.status(400).json({ error: 'scenario required' });
  const scenario = req.body.scenario;
  const budget = req.body.budget;
  const satellitesCount = req.body.satellitesCount;
  const state = createInitialState(scenario, budget, satellitesCount);
  const file = path.join(GAMES_DIR, `${state.id}.json`);
  fs.writeFileSync(file, JSON.stringify(state, null, 2));
  res.json(state);
});

app.post('/api/game/:id/step', (req,res) => {
  const id = req.params.id;
  const file = path.join(GAMES_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'game not found' });
  
  const state = JSON.parse(fs.readFileSync(file));
  const actions = req.body.actions || {};
  const newState = stepTurn(state, actions);
  
  // Evaluar estado del juego y agregar consejos
  const gameStatus = evaluateGameStatus(newState);
  const tips = getStrategicTips(newState);
  
  // Agregar información adicional al estado
  newState.gameStatus = gameStatus;
  newState.strategicTips = tips;
  
  fs.writeFileSync(file, JSON.stringify(newState, null, 2));
  res.json(newState);
});

app.get('/api/game/:id', (req,res) => {
  const id = req.params.id;
  const file = path.join(GAMES_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'game not found' });
  
  const state = JSON.parse(fs.readFileSync(file));
  
  // Evaluar estado del juego cada vez que se consulta
  const gameStatus = evaluateGameStatus(state);
  const tips = getStrategicTips(state);
  
  state.gameStatus = gameStatus;
  state.strategicTips = tips;
  
  res.json(state);
});

// Endpoint para estadísticas económicas detalladas
app.get('/api/game/:id/economics', (req,res) => {
  const id = req.params.id;
  const file = path.join(GAMES_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'game not found' });
  
  const state = JSON.parse(fs.readFileSync(file));
  
  // Calcular estadísticas económicas detalladas
  const totalRevenue = state.totalEarned || 0;
  const totalCosts = state.totalSpent || 0;
  const netProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue * 100).toFixed(2) : 0;
  const activeSats = state.satellites.filter(s => s.status === 'active').length;
  const burnRate = totalCosts / Math.max(1, state.turn - 1);
  const turnsRemaining = state.maxTurns - state.turn + 1;
  const projectedBudget = state.budget - (burnRate * turnsRemaining);
  
  const economics = {
    currentBudget: state.budget,
    totalRevenue,
    totalCosts,
    netProfit,
    profitMargin: parseFloat(profitMargin),
    burnRate: Math.round(burnRate),
    projectedBudget: Math.round(projectedBudget),
    tasksCompleted: state.tasksCompleted || 0,
    collisionCosts: (state.collisions || 0) * 35000,
    emergencyCosts: (state.emergencies || 0) * 8000,
    activeSatellites: activeSats,
    efficiency: activeSats > 0 ? 
      (state.satellites.filter(s => s.status === 'active').reduce((a,s) => a + s.efficiency, 0) / activeSats).toFixed(3) : 0
  };
  
  res.json(economics);
});


// --- API para imágenes de turismo espacial ---
const DATA_FILE = path.join(__dirname, 'images.json');
const ensureDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
};
ensureDataFile();


// Obtener todas las imágenes (con manejo de errores)
app.get('/api/images', (req, res) => {
  try {
    ensureDataFile();
    const arr = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!Array.isArray(arr)) throw new Error('images.json corrupto');
    res.json(arr);
  } catch (err) {
    console.error('Error en GET /api/images:', err);
    res.status(500).json({ error: 'Error al leer imágenes', details: err.message });
  }
});

// Guardar metadata de imagen (con manejo de errores)
app.post('/api/images', (req, res) => {
  try {
    const { platform_id, image_url, lat, lon } = req.body;
    if (!image_url) return res.status(400).json({ error: 'image_url required' });
    ensureDataFile();
    let arr = [];
    try {
      arr = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      if (!Array.isArray(arr)) throw new Error('images.json corrupto');
    } catch (e) {
      arr = [];
    }
    const id = arr.length ? arr[arr.length - 1].id + 1 : 1;
    const item = { id, platform_id: platform_id || null, image_url, lat: lat ?? null, lon: lon ?? null, uploaded_at: Date.now() };
    arr.push(item);
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2));
    res.json(item);
  } catch (err) {
    console.error('Error en POST /api/images:', err);
    res.status(500).json({ error: 'Error al guardar imagen', details: err.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log('Server new listening on', port));
