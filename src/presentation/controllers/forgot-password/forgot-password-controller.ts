import { Crypto } from '../../../data/protocols/criptography/crypto'
import { LoadAccountByEmailRepository } from '../../../data/usecases/add-account/db-add-account-protocols'
import { FindByIdAndUpdateAccount } from '../../../domain/usecases/find-by-id-and-update-account'
import { UserNotFound } from '../../errors/user-not-found'
import { badRequest, serverError } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class ForgotPassword implements Controller {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  private readonly crypto: Crypto

  private readonly findByIdAndUpdateAccount: FindByIdAndUpdateAccount

  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository, crypto: Crypto, findByIdAndUpdateAccount: FindByIdAndUpdateAccount) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.crypto = crypto
    this.findByIdAndUpdateAccount = findByIdAndUpdateAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body
    try {
      const user = await this.loadAccountByEmailRepository.loadByEmail(email)

      if (!user) {
        return badRequest(new UserNotFound('error: User not found'))
      }

      const token = await this.crypto.randomBytes()

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await this.findByIdAndUpdateAccount.findByIdAndUpdateAccount(user._id, token, now)

      return {
        statusCode: 200,
        body: ''
      }
    } catch (error) {
      console.log(error)
      return serverError(error)
    }
  }
}
