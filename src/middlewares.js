const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const jwt = require('jsonwebtoken');

const applyMiddlewares = (app) => {
  // Middlewares básicos que siempre se aplican
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  
  // Middlewares condicionales (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
};

const authMiddleware = (req, res, next) => {
  
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = { applyMiddlewares , authMiddleware };