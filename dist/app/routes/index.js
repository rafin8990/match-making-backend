"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const match_route_1 = require("../modules/match/match.route");
const message_route_1 = require("../modules/message/message.route");
const question_route_1 = require("../modules/question/question.route");
const user_route_1 = require("../modules/user/user.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.LoginRoutes,
    },
    {
        path: '/users',
        route: user_route_1.userRoutes,
    },
    {
        path: '/matches',
        route: match_route_1.MatchMakingRoutes,
    },
    {
        path: '/messages',
        route: message_route_1.MessageRoutes,
    },
    {
        path: '/question',
        route: question_route_1.QuestionRoutes,
    }
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
