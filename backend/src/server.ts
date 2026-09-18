import 'dotenv/config';
import express from 'express';
import { prisma } from './config/prisma';
import membreRoutes from './routes/membre.routes';
import abonnementRoutes from './routes/abonnement.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import cors from 'cors';

const app = express();

const PORT = Number(process.env.PORT) || 3000;

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      frontendUrl,
      'http://localhost:4200'
    ];

    // Autoriser les URLs GitHub Codespaces
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.app.github.dev')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Origine non autorisée par CORS'));
    }
  }
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

app.use('/api/membres', membreRoutes);
app.use('/api/abonnements', abonnementRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'FitCenter API fonctionne'
  });
});

app.listen(PORT, () => {
  console.log(`Serveur FitCenter démarré sur le port ${PORT}`);
});