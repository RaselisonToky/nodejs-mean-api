import { Router } from 'express';
import { check } from 'express-validator';
import modelController from "./model.controller.js";

const router = Router();

const modelValidationRules = [
    check('name')
        .trim()
        .notEmpty().withMessage('Le nom est obligatoire')
        .isLength({ max: 50 }).withMessage('Max 50 caractères')
];

router.get('/', modelController.getAll);
router.get('/:id', modelController.getById);
router.post('/', modelValidationRules, modelController.create);
router.put('/:id', modelValidationRules, modelController.update);
router.delete('/:id', modelController.delete);

export default router;
