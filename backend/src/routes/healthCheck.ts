import { Router } from 'express';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  return res.json({ message: 'Healthy!!' });
});

export default router;