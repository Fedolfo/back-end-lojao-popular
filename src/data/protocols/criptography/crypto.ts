export interface Crypto {
  randomBytes: () => Promise<string>
}