const express = require('express');
const router = express.Router();
const facebookService = require('../services/facebook');
const { validateRequest } = require('../middleware/validation');

// Get leads from Facebook Lead Ads
router.get('/', validateRequest, async (req, res) => {
  try {
    const { pageId, formId, startDate, endDate } = req.query;
    
    if (!pageId) {
      return res.status(400).json({
        error: {
          message: 'Page ID is required',
          code: 'MISSING_PAGE_ID'
        }
      });
    }

    const leads = await facebookService.getLeads(
      pageId,
      formId,
      startDate,
      endDate
    );

    res.json({ data: leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      error: {
        message: error.message,
        code: 'LEADS_FETCH_ERROR'
      }
    });
  }
});

// Get lead forms for a page
router.get('/forms/:pageId', validateRequest, async (req, res) => {
  try {
    const { pageId } = req.params;
    const forms = await facebookService.getLeadForms(pageId);

    res.json({ data: forms });
  } catch (error) {
    console.error('Error fetching lead forms:', error);
    res.status(500).json({
      error: {
        message: error.message,
        code: 'FORMS_FETCH_ERROR'
      }
    });
  }
});

module.exports = router;