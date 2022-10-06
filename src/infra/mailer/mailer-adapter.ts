import nodemailer from 'nodemailer'
import { NodeMailer, SMTPTMailer } from '../../data/protocols/mailer/mailer'

export class NodemailerAdapter implements NodeMailer {
  async transport (): Promise<SMTPTMailer> {
    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '7d0dfa5776018f',
        pass: 'b82f23d86953bb'
      }
    })
  }
}
