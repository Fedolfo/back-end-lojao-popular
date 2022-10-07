import SMTPTransport from 'nodemailer/lib/smtp-transport';
import nodemailer from 'nodemailer'

export interface SMTPTMailer extends nodemailer.Transporter<SMTPTransport.SentMessageInfo> {}

export interface NodeMailer {
  transport: () => Promise<SMTPTMailer>
}