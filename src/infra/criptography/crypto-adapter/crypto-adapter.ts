import { Crypto } from '../../../data/protocols/criptography/crypto'
import crypto from 'crypto'

export class CryptoAdapter implements Crypto {
  async randomBytes(): Promise<string> {
    const hash = await crypto.randomUUID()
    return hash
  }
}
