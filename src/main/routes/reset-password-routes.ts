/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes-adapter'
import { MakeResetPassword } from '../factories/controllers/reset-password/reset-password-controller'

export default (router: Router): void => {
  router.post('/reset_password', adaptRoute(MakeResetPassword()))
}
