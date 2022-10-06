import { Controller, HttpRequest, HttpResponse, FindByIdAndUpdateAccount, LoadAccountByEmailRepository, Crypto, NodeMailer } from './forgot-password-protocols'
import { UserNotFound } from '../../errors/user-not-found'
import { badRequest, noContent, serverError } from '../../helpers/http/http-helper'

export class ForgotPasswordController implements Controller {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  private readonly crypto: Crypto

  private readonly findByIdAndUpdateAccount: FindByIdAndUpdateAccount

  private readonly nodemailer: NodeMailer

  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository, crypto: Crypto, findByIdAndUpdateAccount: FindByIdAndUpdateAccount, nodemailer: NodeMailer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.crypto = crypto
    this.findByIdAndUpdateAccount = findByIdAndUpdateAccount
    this.nodemailer = nodemailer
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body
    try {
      const user = await this.loadAccountByEmailRepository.loadByEmail(email)

      if (!user) {
        return badRequest(new UserNotFound('error: User not found'))
      }

      const token = await this.crypto.randomUUID()

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await this.findByIdAndUpdateAccount.findByIdAndUpdateAccount(user._id, token, now)

      const nodemailMessage = await this.nodemailer.transport()

      await Promise.resolve(nodemailMessage.sendMail({
        to: email,
        from: 'filipecandido123@hotmail.com',
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        html: `<p>Você esqueceu a sua senha? Não tem problema, utilize esse token: ${token} </p> `,
        subject: 'Recuperação de senha'
      }))
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
