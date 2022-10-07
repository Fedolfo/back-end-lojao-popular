import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { FindByEmailAndUpdatePasswordAccount } from '../../../../data/protocols/db/account/find-by-email-and-update-password-account-repository'
import { FindByIdAndUpdateAccountRepository } from '../../../../data/protocols/db/account/find-by-id-and-update-account'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { addAccountModel } from '../../../../domain/usecases/addAccount'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository, FindByIdAndUpdateAccountRepository, FindByEmailAndUpdatePasswordAccount {
  async add(accountData: addAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const { insertedId, ...rest } = result
    return Object.assign({}, rest, { _id: insertedId }) as unknown as AccountModel
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account as unknown as AccountModel
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: id },
      {
        $set: {
          accessToken: token
        }
      }
    )
  };

  async loadByToken(token: string, role?: string | undefined): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    return account as unknown as AccountModel
  };

  async findByIdAndUpdateAccount(id: string, token: string, date: Date): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: date
        }
      }
    )
    return account as unknown as AccountModel
  }

  async findByEmailAndUpdatePasswordAccount(email: string, password: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOneAndUpdate(
      { email },
      {
        $set: {
          password
        }
      }
    )
    return account as unknown as AccountModel
  }
}
