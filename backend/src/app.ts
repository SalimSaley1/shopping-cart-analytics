// src/app.ts
import express from 'express';
import connectDB from './services/db_service';
import productRoutes from './routes/product_route'; 
import cors from 'cors';
import userRoutes from "./routes/user_route";
import saleRoutes from "./routes/sale_route";
import seedRoutes from "./routes/seed_route";
const app = express();

connectDB().then().catch();

app.use(cors());
app.use(express.json());

app.use("/admin", seedRoutes);
app.use("/auth",userRoutes);
app.use("/analytics",saleRoutes);
app.use("/products",productRoutes);




export default app;
