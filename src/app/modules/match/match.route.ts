import express from 'express'
import { MatchMakingController } from './match.controller'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../enums/users'
const router = express.Router()
router.get('/', MatchMakingController.getAllMatchs)
router.get(
  '/match-with-userdetails',
  MatchMakingController.getAllMatchesWithUserDetails
)
// router.get('/matchid/:id', MatchMakingController.getMatchById)
router.get('/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), MatchMakingController.getUser)
router.get('/suggestions/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), MatchMakingController.getSuggestions)
router.post('/create-match',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), MatchMakingController.createMatch)
router.post('/resend-match',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), MatchMakingController.resendMatch)
router.patch('/match-response/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), MatchMakingController.handleAccept)
router.patch('/update-match',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), MatchMakingController.UpdateMatch)
router.patch('/check-match',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), MatchMakingController.CheckMatch)
router.patch('/delete-unmatch',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), MatchMakingController.DeleteUnmatch)

export const MatchMakingRoutes = router
