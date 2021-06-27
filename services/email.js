const Mailgen = require('mailgen')
require('dotenv').config()

class EmailService {
    constructor(env, sender) {
        this.sender = sender
        switch (env) {
            case 'development':
                this.link = 'https://localhost:3000'
                break
            case 'production':
                this.link = 'link for production'
                break
            default:
                this.link = 'https://localhost:3000'
                break
        }
    }
    // 'https://bba7a084e887.ngrok.io'
    #createTemplateVerificationEmail(verifyToken, name) {
        const mailGenerator = new Mailgen({
            theme: 'default',
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
    }
        }
       return mailGenerator.generate(email);
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