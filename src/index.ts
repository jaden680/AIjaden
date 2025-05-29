import express from 'express';
import cors from 'cors';
import path from 'path';
import { scrumRouter } from './routes/scrum';
import { qaRouter } from './routes/qa';
import { prRouter } from './routes/pr';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Serve static files from the public directory
app.use(express.static('public'));

// API Routes
app.use('/scrum', scrumRouter);
app.use('/qa', qaRouter);
app.use('/pr', prRouter);

// Root route with landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/landing.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
