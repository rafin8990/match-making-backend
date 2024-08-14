"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchMakingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const match_controller_1 = require("./match.controller");
const router = express_1.default.Router();
router.get('/:id', match_controller_1.MatchMakingController.getUser);
router.get('/suggestions/:id', match_controller_1.MatchMakingController.getSuggestions);
router.post('/create-match', match_controller_1.MatchMakingController.createMatch);
router.patch('/match-response/:id', match_controller_1.MatchMakingController.handleAccept);
exports.MatchMakingRoutes = router;
