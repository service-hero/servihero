const express = require('express');
const router = express.Router();
const ghlService = require('../services/ghl');
const { validateRequest } = require('../middleware/validation');

// Get contacts
router.get('/contacts', validateRequest, async (req, res) => {
  try {
    const contacts = await ghlService.getContacts(req.query);
    res.json({ data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      error: {
        message: error.message,
        code: 'CONTACTS_FETCH_ERROR'
      }
    });
  }
});

// Create contact
router.post('/contacts', validateRequest, async (req, res) => {
  try {
    const contact = await ghlService.createContact(req.body);
    res.status(201).json({ data: contact });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      error: {
        message: error.message,
        code: 'CONTACT_CREATE_ERROR'
      }
    });
  }
});

// Get opportunities
router.get('/opportunities', validateRequest, async (req, res) => {
  try {
    const opportunities = await ghlService.getOpportunities(req.query);
    res.json({ data: opportunities });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({
      error: {
        message: error.message,
        code: 'OPPORTUNITIES_FETCH_ERROR'
      }
    });
  }
});

// Create opportunity
router.post('/opportunities', validateRequest, async (req, res) => {
  try {
    const opportunity = await ghlService.createOpportunity(req.body);
    res.status(201).json({ data: opportunity });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    res.status(500).json({
      error: {
        message: error.message,
        code: 'OPPORTUNITY_CREATE_ERROR'
      }
    });
  }
});

module.exports = router;