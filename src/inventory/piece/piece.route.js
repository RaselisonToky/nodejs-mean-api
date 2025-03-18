import { Router } from "express";
import pieceController from "./piece.controller.js";

const router = new Router();

router.get("/", pieceController.getAll);

export default router;
