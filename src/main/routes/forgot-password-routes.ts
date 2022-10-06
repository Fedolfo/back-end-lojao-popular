/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes-adapter'
import { MakeForgotPassword } from '../factories/controllers/forgot-password/forgot-password-controller-factory'

export default (router: Router): void => {
  router.post('/forgot_password', adaptRoute(MakeForgotPassword()))
}
