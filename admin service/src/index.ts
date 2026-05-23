import express from "express"
import dotenv from "dotenv";
import {sql} from "./config/db.js";
import adminRoutes from "./route.js";
import cloudinary from "cloudinary";
import cors from "cors";
import { createClient } from "redis";

dotenv.config();

const redisPassword = process.env.Redis_Password;

if (!redisPassword) {
  throw new Error("Redis_Password is missing");
}

export const redisClient = createClient({
  password: redisPassword,
  socket: {
    host: "redis-15223.crce281.ap-south-1-3.ec2.cloud.redislabs.com",
    port: 15223,
    reconnectStrategy: (retries) => {
      if (retries > 10) return false;
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});

await redisClient.connect();
console.log("connected to redis");

const cloudName = process.env.Cloud_Name;
const cloudApiKey = process.env.Cloud_Api_Key;
const cloudApiSecret = process.env.Cloud_Api_Secret;

if (!cloudName || !cloudApiKey || !cloudApiSecret) {
  throw new Error("Cloudinary env variables are missing");
}

cloudinary.v2.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudApiSecret,
});

const app = express();
app.use(cors());
app.use(express.json());
async function initDB(){
  try{
    await sql`
    CREATE TABLE IF NOT EXISTS albums(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      thumbnail VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

    await sql`
    CREATE TABLE IF NOT EXISTS songs(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255),
    audio VARCHAR(255) NOT NULL,
    album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;
    console.log("Database initialized successfully");
  }catch(error){
    console.log("Error initDb", error);
  }
}
app.use("/api/v1/admin",adminRoutes);
const port = process.env.PORT;
initDB().then(()=>{
  app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
  });
});