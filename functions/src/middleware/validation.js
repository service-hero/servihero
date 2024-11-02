const validateRequest = (req, res, next) => {
  // Validate query parameters
  if (req.query.startDate && !isValidDate(req.query.startDate)) {
    return res.status(400).json({
      error: {
        message: 'Invalid start date format',
        code: 'INVALID_DATE_FORMAT'
      }
    });
  }

  if (req.query.endDate && !isValidDate(req.query.endDate)) {
    return res.status(400).json({
      error: {
        message: 'Invalid end date format',
        code: 'INVALID_DATE_FORMAT'
      }
    });
  }

  // Validate page ID format
  if (req.params.pageId && !isValidPageId(req.params.pageId)) {
    return res.status(400).json({
      error: {
        message: 'Invalid page ID format',
        code: 'INVALID_PAGE_ID'
      }
    });
  }

  next();
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const isValidPageId = (pageId) => {
  return /^\d+$/.test(pageId);
};

module.exports = {
  validateRequest
};