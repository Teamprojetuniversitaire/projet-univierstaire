import { body, validationResult } from 'express-validator';

export const validateCSVStructure = (requiredFields) => {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array()
      });
    }
    next();
  };
};

export const csvUploadValidation = [
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('Aucun fichier CSV fourni');
    }
    return true;
  })
];
