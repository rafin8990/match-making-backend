import express from 'express'
import { MatchMakingController } from './match.controller'
const router = express.Router()
router.get('/', MatchMakingController.getAllMatchs)
router.get(
  '/match-with-userdetails',
  MatchMakingController.getAllMatchesWithUserDetails
)
// router.get('/matchid/:id', MatchMakingController.getMatchById)
router.get('/:id', MatchMakingController.getUser)
router.get('/suggestions/:id', MatchMakingController.getSuggestions)
router.post('/create-match', MatchMakingController.createMatch)
router.post('/resend-match', MatchMakingController.resendMatch)
router.patch('/match-response/:id', MatchMakingController.handleAccept)
router.patch('/update-match', MatchMakingController.UpdateMatch)
router.patch('/update-unmatch', MatchMakingController.UpdateUnmatch)

export const MatchMakingRoutes = router
