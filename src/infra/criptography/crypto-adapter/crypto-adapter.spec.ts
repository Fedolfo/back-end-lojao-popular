import crypto from 'crypto'
import { CryptoAdapter } from './crypto-adapter'

jest.mock('crypto', () => ({
  async randomUUID(): Promise<string> {
    return await new Promise(resolve => resolve('any_token'))
  }
}))

const makeSut = (): CryptoAdapter => {
  return new CryptoAdapter()
}

describe('Crypto Adapter', () => {
  it('Should call randomUUID with correct values', async () => {
    const sut = makeSut()
    const cryptoSpy = jest.spyOn(crypto, 'randomUUID')
    await sut.randomUUID()
    expect(cryptoSpy).toHaveBeenCalled()
  })

  it('Should return a valid token on randomUUID success', async () => {
    const sut = makeSut()
    const hash = await sut.randomUUID()
    expect(hash).toBe('any_token')
  })

  it('Should throw if randomUUID throws', async () => {
    const sut = makeSut()
    const cryptoSpy = jest.spyOn(crypto, 'randomUUID') as unknown as jest.Mock<ReturnType<(key: Error) => Promise<Error>>, Parameters<(key: Error) => Promise<Error>>>
    cryptoSpy.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.randomUUID()
    await expect(promise).rejects.toThrow()
  })
})
