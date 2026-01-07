import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';

const app = express();
app.use(cors());
app.use(express.json());

// Rate limit pour les routes API (dev server)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par fenêtre
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);

// Vite integration (dev) or static (prod)
const DEFAULT_PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';

async function start() {
  const port = await getAvailablePort(DEFAULT_PORT);
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dist = path.resolve(__dirname, 'dist');
    app.use(express.static(dist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(dist, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`✅ Server ready on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Server start failed', err);
  process.exit(1);
});

function getAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const tryPort = (p) => {
      const tester = net.createServer()
        .once('error', (err) => {
          if (err && err.code === 'EADDRINUSE') {
            if (p - startPort < 20) {
              tryPort(p + 1);
            } else {
              reject(new Error('No available port in range'));
            }
          } else {
            reject(err);
          }
        })
        .once('listening', () => {
          tester.close(() => resolve(p));
        })
        .listen(p, '0.0.0.0');
    };
    tryPort(startPort);
  });
}
