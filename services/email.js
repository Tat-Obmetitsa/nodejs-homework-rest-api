const Mailgen = require('mailgen')
require('dotenv').config()

class EmailService {
    constructor(env, sender) {
        this.sender = sender
        switch (env) {
            case 'development':
                this.link = 'https://localhost:8443'
                break
            case 'production':
                this.link = 'link for production'
                break
            default:
                this.link = 'https://localhost:8443'
                break
        }
    }
    #createTemplateVerificationEmail(verifyToken, name) {
        const mailGenerator = new Mailgen({
            theme: 'testmail',
            product: {
                name: 'Trinka',
                link: this.link
            }
        })
        const email = {
            body: {
            name,
            intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Mailgen, please click here:',
                button: {
                    color: '#22BC66',
                    text: 'Confirm your account',
                    link: `${this.link}/api/users/verify/${verifyToken}`
                }
            },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
        }
       return emailBody = mailGenerator.generate(email);
    }
    async sendVerifyEmail(verifyToken, email, name) {
        const emailHtml = this.#createTemplateVerificationEmail(verifyToken, name)
        const msg = {
            to: email,
            subject: 'Verify it',
            html: emailHtml
        }
        const result = await this.sender.send(msg)
        console.log(result)
    }
}

module.exports = EmailService