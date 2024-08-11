import express from 'express';
import { MatchMakingController } from './match.controller';
const router = express.Router();
router.get('/:id', MatchMakingController.getUser);
router.get('/suggestions/:id', MatchMakingController.getSuggestions);
router.post('/create-match',MatchMakingController.createMatch);
router.patch('/match-response/:id',MatchMakingController.handleAccept);


export const MatchMakingRoutes = router;
