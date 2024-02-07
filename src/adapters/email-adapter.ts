import nodemailer from 'nodemailer'
import {MAIL_RU_PASS} from "../config";


export class EmailAdapter {
    static async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            service: 'Mail.ru',
            secure: false,
            auth: {
                user: 'vx3110@mail.ru',
                pass: MAIL_RU_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        })
        let sendingMail = await transport.sendMail({
            from: 'Vlad <vx3110@mail.ru>',
            to: email,
            subject: subject,
            html: message,
        })
        return sendingMail
    }
    //     let args = {
    //         from: 'Vlad <vx3110@mail.ru>',
    //         to: email,
    //         subject: subject,
    //         html: message
    //     }
    //     let info = await transport.sendMail(args)
    //
    //     return info
    // }
}