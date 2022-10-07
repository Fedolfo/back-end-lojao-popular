import { AccountModel } from "../../../usecases/add-account/db-add-account-protocols";

export interface FindByEmailAndUpdatePasswordAccount {
  findByEmailAndUpdatePasswordAccount: (email: string, password: string) => Promise<AccountModel>
}