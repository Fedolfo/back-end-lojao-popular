import { Crypto } from '../../../data/protocols/criptography/crypto'
import crypto from 'crypto'

export class CryptoAdapter implements Crypto {
  async randomUUID(): Promise<string> {
    return crypto.randomUUID()
  }
}
