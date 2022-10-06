import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'

import SMTPTransport from 'nodemailer/lib/smtp-transport'
import path from 'path'
import { NodeMailerRepository } from '../../data/protocols/mailer/mailer-repository'

export class Nodemailer implements NodeMailerRepository {
  transport (): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
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

const nodemailerTranposter = new Nodemailer()

nodemailerTranposter.transport().use('compile', hbs({
  viewEngine: { defaultLayout: 'handlebars' },
  viewPath: path.resolve('./src/resources/mail'),
  extName: '.html'
}))
