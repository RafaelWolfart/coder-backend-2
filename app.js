import express from "express";
import logger from "./middlewares/logger.middleware.js";
import passport from "./config/passport.config.js";
import config from "./config/env.config.js";
import {
  connectMongoDB,
  connectMongoAtlasDB,
} from "./config/db/connect.config.js";
import apiRouter from "./routes/index.js";

const app = express();
const PORT = config.port;
const ATLAS = false;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Inicializar Passport
app.use(passport.initialize());

// Rutas
app.use(apiRouter);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

const startServer = async () => {
  try {
    ATLAS ? await connectMongoAtlasDB() : await connectMongoDB();
    app.listen(PORT, () =>
      console.log(
        `✅ Servidor escuchando en http://localhost:${PORT} - Env: ${config.nodeEnv}`
      )
    );
  } catch (err) {
    console.error("Error al iniciar el servidor:", err);
    process.exit(1);
  }
};

await startServer();
