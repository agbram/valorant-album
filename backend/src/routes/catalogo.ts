import express from 'express';
import { CatalogoController } from '../controllers/catalogoController.js';

const router = express.Router();

router.post("/", CatalogoController.store);
router.get("/", CatalogoController.index);
router.put("/:id", CatalogoController.update);
router.patch("/:id", CatalogoController.update)
router.delete("/:id", CatalogoController.delete);
router.get("/:id", CatalogoController.show);

export default router;