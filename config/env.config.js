import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  mongoURL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/backend77080",
  mongoAtlasURL: process.env.MONGO_ATLAS_URL,
  mongoTarget: process.env.MONGO_TARGET || "LOCAL",
  jwtSecret: process.env.JWT_SECRET || "clave_secreta_jwt",
  jwtExpire: process.env.JWT_EXPIRE || "24h",
  secretSession: process.env.SECRET_SESSION || "clave_secreta",
  nodeEnv: process.env.NODE_ENV || "development",
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallbackUrl: process.env.GITHUB_CALLBACK_URL,
};

export default config;
