import express from 'express'
import { LoginRoutes } from '../modules/auth/auth.route'
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
  }
]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
