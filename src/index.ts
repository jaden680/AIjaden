import express from 'express';
import cors from 'cors';
import { scrumRouter } from './routes/scrum';
import { qaRouter } from './routes/qa';
import { prRouter } from './routes/pr';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/scrum', scrumRouter);
app.use('/qa', qaRouter);
app.use('/pr', prRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
