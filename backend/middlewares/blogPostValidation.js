import { body, validationResult } from 'express-validator';

export const blogPostValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').isMongoId().withMessage('Invalid author ID'),
  body('readTime.value')
    .isNumeric()
    .withMessage('readTime.value must be a number'),
  body('readTime.unit')
    .isIn(['minute', 'minutes', 'hour', 'hours'])
    .withMessage('readTime.unit must be a valid time unit'),
];

export const validateBlogPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
