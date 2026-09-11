import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FitCenter API',
      version: '1.0.0',
      description: 'API de gestion du centre sportif FitCenter'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur local'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
});