const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

const app=express();
const normalizeOrigin = (url) => (url ? url.replace(/\/$/, '') : url);

const allowedOrigins = [
  process.env.LOCAL_FRONTEND_URL,
  process.env.PRODUCTION_FRONTEND_URL,
  process.env.PRODUCTION_API_FRONTEND_URL,
].map(normalizeOrigin);

app.use(
  cors({
    origin: function (origin, callback) {
      const normalizedOrigin = normalizeOrigin(origin);
      if (!origin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/budget', budgetRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/expenses', expenseRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 MongoDB connected successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});