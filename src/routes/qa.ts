import { Router } from 'express';

const router = Router();

// Get answer to a question
router.post('/answer', (req, res) => {
  const { question } = req.body;
  res.json({ 
    question,
    answer: 'This is a sample answer to your question.'
  });
});

// Get all questions
router.get('/questions', (req, res) => {
  res.json([
    { id: 1, question: 'Sample question 1' },
    { id: 2, question: 'Sample question 2' }
  ]);
});

export { router as qaRouter };
