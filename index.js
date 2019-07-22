
// Load core modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Enable reading env varibles
dotenv.config();

// Connect to Db
mongoose.connect(process.env.DB_URL, { useNewUrlParser : true }).then(res => console.log("Connected!")).catch(er => console.log(er));

// Initialize express server
const server = express();

// Setting up middlewares
server.use(express.json());


// Fireup server and provide port
const PORT = process.env.PORT;
server.listen(PORT, event => console.log("Started!"));




