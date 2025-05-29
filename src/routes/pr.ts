import { Router } from 'express';

const router = Router();

// Create a new PR
router.post('/create', (req, res) => {
  res.json({ message: 'PR created' });
});

// Get all PRs
router.get('/', (req, res) => {
  res.json([
    { id: 1, title: 'Sample PR 1', status: 'open' },
    { id: 2, title: 'Sample PR 2', status: 'merged' }
  ]);
});

// Get PR details
router.get('/:id', (req, res) => {
  res.json({
    id: req.params.id,
    title: 'Sample PR',
    status: 'open',
    description: 'This is a sample PR'
  });
});

export { router as prRouter };
