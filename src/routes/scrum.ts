import { Router } from 'express';
import { scrumService } from '../services/scrum.service';

const router = Router();

// Generate and send scrum report
router.post('/generate', async (req, res) => {
  try {
    const report = await scrumService.generateScrumReport();
    await scrumService.sendToSlack(report);
    res.json({ success: true, message: 'Scrum report generated and sent to Slack' });
  } catch (error: unknown) {
    console.error('Error generating scrum report:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate scrum report',
      error: errorMessage
    });
  }
});

// Get scrum report without sending to Slack (for preview)
router.get('/preview', async (req, res) => {
  try {
    const report = await scrumService.generateScrumReport();
    res.json({ success: true, report });
  } catch (error: unknown) {
    console.error('Error generating scrum preview:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate scrum preview',
      error: errorMessage
    });
  }
});

export { router as scrumRouter };
