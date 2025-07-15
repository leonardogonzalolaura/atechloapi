const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();
const app = express();


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de ATECHLO',
      version: '1.0.0',
      description: 'Documentación de la API de servicios de ATECHLO',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? process.env.SERVER_URL_PRODUCTION 
          : process.env.SERVER_URL_LOCAL,
        description: process.env.NODE_ENV === 'production' 
          ? 'Servidor de producción' 
          : 'Servidor local',
      },
    ],
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api/swaggerUI', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middlewares
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// Rutas
app.get('/api', (req, res) => {
  res.json({ message: 'API de atechlo.com' });
});

app.use('/api', require('./routes/chatRoutes'));

module.exports = app;