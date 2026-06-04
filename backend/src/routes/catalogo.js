import express from 'express';
import { CatalogoController } from '../controllers/catalgoController.js';

const router = express.Router();

router.post("/", CatalogoController.store);
router.get("/", CatalogoController.index);
router.put("/:id", CatalogoController.update);
router.patch("/:id", CatalogoController.update)
router.delete("/:id", CatalogoController.delete);

export default router;