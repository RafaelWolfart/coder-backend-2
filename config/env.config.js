import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  mongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/backend77080',
  mongoAtlasURI: process.env.MONGODB_ATLAS_URI,
  jwtSecret: process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_aqui',
  jwtExpire: process.env.JWT_EXPIRE || '24h',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
