import express from "express"
import dotenv from "dotenv"
import songRoutes from "./route.js";
import cors from "cors";
import { createClient } from "redis";

dotenv.config();
const redisPassword = process.env.Redis_Password;

if (!redisPassword) {
  throw new Error("Redis_Password is missing in .env");
}

export const redisClient = createClient({
  password: redisPassword,
  socket: {
    host: "redis-15223.crce281.ap-south-1-3.ec2.cloud.redislabs.com",
    port: 15223,
  },
});

redisClient.on("error", (err: any) => {
  console.log("Redis Client Error:", err);
});

await redisClient.connect();

console.log("Redis Connected");

const app = express();
app.use(cors());
app.use("/api/v1",songRoutes);
const port =  process.env.PORT;
app.listen(port,()=>{
  console.log(`Server is running on ${port}`);
});