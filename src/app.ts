import express from 'express';
import mongoose from 'mongoose';
import walletRoutes from './routes/walletRoutes';
import conversionRoutes from './routes/conversionRoutes';

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/crypto', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/wallet', walletRoutes);
app.use('/api/conversion', conversionRoutes);

export default app;