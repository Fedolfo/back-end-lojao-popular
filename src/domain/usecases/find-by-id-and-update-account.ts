import { AccountModel } from '../models/account'

export interface FindByIdAndUpdateAccount {
  findByIdAndUpdateAccount: (id: string, token: string, date: Date) => Promise<AccountModel | null>
}
