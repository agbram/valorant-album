import express from 'express';
import { AlbumController } from '../controllers/albumController.js';

const router = express.Router();

router.post('/:figurinhaId', AlbumController.adicionar);
router.get('/', AlbumController.listar);
router.delete('/:figurinhaId', AlbumController.remover);
router.get('/stats', AlbumController.stats);

export default router;