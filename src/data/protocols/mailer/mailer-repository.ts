import SMTPTransport from 'nodemailer/lib/smtp-transport';
import nodemailer from 'nodemailer'

export interface NodeMailerRepository {
  transport: () => nodemailer.Transporter<SMTPTransport.SentMessageInfo>
}