import { HttpRequest, HttpResponse, Controller, LoadAccountByEmailRepository, Hasher } from './reset-password-protocols'
import { UserNotFound } from '../../errors/user-not-found'
import { badRequest, noContent, serverError } from '../../helpers/http/http-helper'
import { FindByEmailAndUpdatePasswordAccount } from '../../../data/protocols/db/account/find-by-email-and-update-password-account-repository'

export class ResetPasswordController implements Controller {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  private readonly hasher: Hasher

  private readonly findByEmailAndUpdatePasswordAccount: FindByEmailAndUpdatePasswordAccount

  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository, hasher: Hasher, findByEmailAndUpdatePasswordAccount: FindByEmailAndUpdatePasswordAccount) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hasher = hasher
    this.findByEmailAndUpdatePasswordAccount = findByEmailAndUpdatePasswordAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, token, password } = httpRequest.body

    try {
      const user = await this.loadAccountByEmailRepository.loadByEmail(email)

      if (!user) {
        return badRequest(new UserNotFound('error: User not found'))
      }

      if (token !== user.passwordResetToken) {
        return badRequest(new UserNotFound('error: Token Invalid'))
      }

      const now = new Date()
      if (now > user.passwordResetExpires) {
        return badRequest(new UserNotFound('error: Token expired, generate a new one'))
      }

      await this.findByEmailAndUpdatePasswordAccount.findByEmailAndUpdatePasswordAccount(email, await this.hasher.hash(password))

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
