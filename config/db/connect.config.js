import mongoose from "mongoose";
import config from "../env.config.js";

export const connectMongoDB = async () => {
  try {
    const uri = config.mongoTarget === 'ATLAS' ? config.mongoAtlasURL : config.mongoURL;
    await mongoose.connect(uri);
    console.log(`✅ Conectado a MongoDB (${config.mongoTarget}) de forma exitosa.!!`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
