import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { ResetPasswordController } from '../../../../presentation/controllers/reset-password/reset-password-controller'
import { Controller } from '../../../../presentation/protocols'
import { MakeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const MakeResetPassword = (): Controller => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const bCryptAdapter = new BcryptAdapter(salt)
  const forgotPasswordController = new ResetPasswordController(accountMongoRepository, bCryptAdapter, accountMongoRepository)
  return MakeLogControllerDecorator(forgotPasswordController)
}
