import { HttpResponse, HttpRequest, Controller, AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, serverError, ok, forbidden } from '../../../helpers/http/http-helper'
import { EmailInUseError } from '../../../errors'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount

  private readonly validation: Validation

  private readonly authentication: Authentication

  constructor(addAccount: AddAccount, validation: Validation, authentication: Authentication) {
    this.addAccount = addAccount
    this.validation = validation
    this.authentication = authentication
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name, email, password
      })

      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return ok({ accessToken })
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
