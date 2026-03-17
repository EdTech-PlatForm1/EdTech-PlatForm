import { config } from "dotenv";
import mongoose from "mongoose";
config()
const dbconeection=async()=>{
  await mongoose.connect(process.env.DB_URI).then(res=>{
    console.log(`db connected`)
  }).catch(err=>console.error(`fail to connect on db`,err))
} 
export default dbconeection