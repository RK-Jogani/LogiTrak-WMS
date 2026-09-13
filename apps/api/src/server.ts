import http from "http";
import app from "./app.js";

const PORT = process.env.API_PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 LogiTrack API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
