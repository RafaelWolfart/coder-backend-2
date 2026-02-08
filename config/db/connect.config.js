import mongoose from "mongoose";
import config from "../env.config.js";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log(`✅ Conectado a MongoDB de Forma exitosa.!!`)
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}

export const connectMongoAtlasDB = async () => {
    try {
        await mongoose.connect(config.mongoAtlasURI);
        console.log(`✅ Conectado a Mongo Atlas de Forma exitosa.!!`)
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}