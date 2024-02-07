import nodemailer from 'nodemailer'
import {GMAIL_PASS} from "../config";


export class EmailAdapter {
    static async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            service: 'Gmail',
            secure: false,
            auth: {
                user: 'veronicavlad130@gmail.ru',
                pass: GMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        })
        let sendingMail = await transport.sendMail({
            from: 'Vlad <veronicavlad130@gmail.ru>',
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