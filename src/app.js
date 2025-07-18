const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { swaggerServe, swaggerSetup } = require('./swagger_doc');
const { applyMiddlewares , authMiddleware } = require('./middlewares');

dotenv.config();
const app = express();

//========== ADD SWAGGER ============ //
app.use('/api/swaggerUI', swaggerServe , swaggerSetup );


//========== ADD MIDDLEWARE ============ //
applyMiddlewares(app);


app.post('/api/token', (req, res) => {
  const { user, password } = req.body; 

  // Verificar si se proporcionaron usuario y contraseña
  if (!user || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }
  
  const validUser = process.env.AUTH_USER;
  const validPassword = process.env.AUTH_PASSWORD;

  if (user !== validUser || password !== validPassword) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { id: user }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});

// Aplicar a las rutas protegidas
app.use('/api', authMiddleware);

// Rutas
app.get('/api', (req, res) => {
  res.json({ message: 'API de atechlo.com' });
});

app.use('/api', require('./routes/chatRoutes'));

module.exports = app;