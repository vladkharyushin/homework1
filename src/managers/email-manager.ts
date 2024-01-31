import {EmailAdapter} from "../adapters/email-adapter";

export class emailsManager {
    static async sendEmailConfirmationMessage(email: string, code: string) {
        const message = `<h1>Thanks for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
    </p>`

        const subject = `Registration confirmation`

        await EmailAdapter.sendEmail(email, subject, message)
    }

    static async resendConfirmationMessage(email: string, code: string) {
        const message = `<h1>Thanks for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
    </p>`;

        const subject = `Resending registration confirmation `

        await EmailAdapter.sendEmail(email, subject, message)
    }
}