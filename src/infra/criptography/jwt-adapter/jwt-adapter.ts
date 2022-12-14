import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'

import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  private readonly secret: string

  constructor(secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret, {
      expiresIn: '6d'
    })
    return accessToken
  }

  async decrypt (token: string): Promise<string | null> {
    const value: any = jwt.verify(token, this.secret)
    return value
  }
}
