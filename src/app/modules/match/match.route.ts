import express from 'express';
import { MatchMakingController } from './match.controller';
const router = express.Router();

router.get('/find-match/:id', MatchMakingController.findSuggestedMatches);


export const MatchMakingRoutes = router;
