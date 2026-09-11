import 'dotenv/config';
import express from 'express';
import { prisma } from './config/prisma';
import membreRoutes from './routes/membre.routes';
import abonnementRoutes from './routes/abonnement.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import cors from 'cors';

const app = express();

const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:4200'
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
  console.log(`Serveur FitCenter démarré sur http://localhost:${PORT}`);
});