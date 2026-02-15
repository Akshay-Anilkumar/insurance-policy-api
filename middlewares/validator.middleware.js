const { body, query, validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.uploadValidation = [
  body('file').custom((value, { req }) => {
    if (!req.file) throw new Error('File is required');
    const allowedTypes = ['.xlsx', '.xls', '.csv'];
    const ext = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
    if (!allowedTypes.includes(ext)) throw new Error('Only Excel/CSV files allowed');
    return true;
  })
];

exports.searchValidation = [
  query('username')
    .notEmpty().withMessage('Username is required')
    .trim()
];

exports.aggregateValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];