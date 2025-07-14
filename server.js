const app = require('./src/app');
const PORT = process.env.PORT || 3000; // Usa el puerto del entorno o 3000 por defecto

app.listen(PORT, () => {
  const serverUrl = process.env.NODE_ENV === 'production' 
    ? process.env.SERVER_URL_PRODUCTION 
    : `http://localhost:${PORT}`;
    console.log(`API corriendo en ${serverUrl}`);
});