import { Router } from 'express';
import { check } from 'express-validator';
import brandController from './brand.controller.js';

const router = Router();

const brandValidationRules = [
    check('name')
        .trim()
        .notEmpty().withMessage('Le nom est obligatoire')
        .isLength({ max: 50 }).withMessage('Max 50 caractères')
];

router.get('/', brandController.getAll);
router.get('/:id', brandController.getById);
router.post('/', brandValidationRules, brandController.create);
router.put('/:id', brandValidationRules, brandController.update);
router.delete('/:id', brandController.delete);

export default router;
