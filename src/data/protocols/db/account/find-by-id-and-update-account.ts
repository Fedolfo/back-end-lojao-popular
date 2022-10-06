import { AccountModel } from "../../../usecases/add-account/db-add-account-protocols";

export interface FindByIdAndUpdateAccountRepository {
  findByIdAndUpdateAccount: (id: string, token: string, date: Date) => Promise<AccountModel | null>
}