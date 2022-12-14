import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    it('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      })
      expect(account).toBeTruthy()
      expect(account._id).toBeTruthy()
    })
  })

  describe('loadByEmail()', () => {
    it('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      })
      const account = await sut.loadByEmail('any_email@email.com')
      expect(account).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })

    it('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@email.com')
      expect(account).toBeFalsy()
    })
  })

  describe('UpdateAccessToken()', () => {
    it('Should update the account accessToken on UpdateAccessToken success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      })

      await sut.updateAccessToken(res.insertedId.toString(), 'any_token')
      const account = await accountCollection.findOne({
        _id: res.insertedId
      })

      expect(account).toBeTruthy() // n??o sei o que fazer aqui, o insertedId retorna apenas o id
    })
  })

  describe('loadByToken()', () => {
    it('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      // expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })

    it('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })

    it('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })

    it('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    it('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })

  describe('findByIdAndUpdateAccount()', () => {
    it('Should update the account passwordResetToken and passwordResetExpires on findByIdAndUpdateAccount success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordResetToken: 'any_token',
        passwordResetExpires: '2022-10-06T16:14:44.976Z'
      })

      await sut.findByIdAndUpdateAccount(res.insertedId.toString(), 'any_token', new Date())

      const account = await accountCollection.findOne({
        _id: res.insertedId
      })
      expect(account).toBeTruthy()
      expect(account?.email).toBe('any_email@email.com')
      expect(account?.password).toBe('any_password')
      expect(account?.passwordResetToken).toBe('any_token')
      expect(account?.passwordResetExpires).toBe('2022-10-06T16:14:44.976Z')
    })
  })
})
