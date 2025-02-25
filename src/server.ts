import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import { requestLogger, errorLogger } from './middleware/loggingMiddleware';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';
import healthCheckRoutes from "./routes/healthCheckRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/', healthCheckRoutes);


app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});