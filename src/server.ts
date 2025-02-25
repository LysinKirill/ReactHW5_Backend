import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import { requestLogger, errorLogger } from './middleware/loggingMiddleware';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register request logger
app.use(requestLogger);

// Register routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Register error-handling middleware
app.use(errorLogger); // Log errors
app.use(errorHandler); // Handle errors

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});