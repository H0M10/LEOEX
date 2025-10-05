Server_new: minimal REST backend for LEO Decisions

Usage:
  cd server_new
  npm install
  npm run start

Endpoints:
  GET /health
  POST /api/game/start  { scenario }
  POST /api/game/:id/step  { actions }
  GET  /api/game/:id

Notes:
- This server runs on port 9002 by default to avoid conflicts with existing server.
- It's intentionally minimal; once validated you can point frontend to port 9002 or stop the older server.
