import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();

//middlewares
app.use(rateLimiter);
app.use(express.json());
app.use("/api/transactions", transactionRoute);

console.log(process.env.PORT);
const PORT = process.env.PORT || 3000;

initDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server is listing on port http://localhost:", PORT);
  });
});
