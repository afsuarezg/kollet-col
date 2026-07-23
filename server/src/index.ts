import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import casesRouter from './routes/cases';
import { requireAuth } from './auth';
import { getDb } from './db';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

// Initialize DB on startup
getDb();

// All /api/* routes require an authenticated, allowed-domain user (see auth.ts).
app.use('/api', requireAuth);

// Current user identity + derived role, for the client to display.
app.get('/api/me', (req, res) => {
  res.json(req.user);
});

app.use('/api/cases', casesRouter);

// Serve built client in production
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Kollect server running on http://localhost:${PORT}`);
});
