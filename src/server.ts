import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import authRoutes from './routes/authRoutes';
import { requestLogger, errorLogger } from './middleware/loggingMiddleware';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import healthCheckRoutes from "./routes/healthCheckRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/', healthCheckRoutes);

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});