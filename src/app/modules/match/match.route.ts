import express from 'express';
import { MatchMakingController } from './match.controller';
const router = express.Router();
router.get('/:id', MatchMakingController.getUser);
router.get('/suggestions/:id', MatchMakingController.getSuggestions);


export const MatchMakingRoutes = router;
