import { CryptoAdapter } from '../../../../infra/criptography/crypto-adapter/crypto-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { NodemailerAdapter } from '../../../../infra/mailer/mailer-adapter'
import { ForgotPasswordController } from '../../../../presentation/controllers/forgot-password/forgot-password-controller'
import { Controller } from '../../../../presentation/protocols'
import { MakeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const MakeForgotPassword = (): Controller => {
  const cryptoadapter = new CryptoAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const nodemailer = new NodemailerAdapter()
  const forgotPasswordController = new ForgotPasswordController(accountMongoRepository, cryptoadapter, accountMongoRepository, nodemailer)
  return MakeLogControllerDecorator(forgotPasswordController)
}
