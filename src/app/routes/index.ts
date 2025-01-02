import express from 'express'
import { AnswerRoutes } from '../modules/answer/answer.route'
import { LoginRoutes } from '../modules/auth/auth.route'
import { MatchMakingRoutes } from '../modules/match/match.route'
import { MessageRoutes } from '../modules/message/message.route'
import { NoteRoutes } from '../modules/note/note.route'
import { NotificationRoutes } from '../modules/notification/notification.route'
import { QuestionRoutes } from '../modules/question/question.route'
import { ReplyMessageRoutes } from '../modules/replyMessage/replyMessage.route'
import { TemplateRoutes } from '../modules/templete/template.route'
import { userRoutes } from '../modules/user/user.route'
const router = express.Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: LoginRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/matches',
    route: MatchMakingRoutes,
  },
  {
    path: '/messages',
    route: MessageRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/reply-messages',
    route: ReplyMessageRoutes,
  },
  {
    path: '/templates',
    route: TemplateRoutes,
  },
  {
    path: '/questions',
    route: QuestionRoutes,
  },
  {
    path: '/note',
    route: NoteRoutes,
  },
  {
    path: '/answer',
    route: AnswerRoutes,
  },
]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
