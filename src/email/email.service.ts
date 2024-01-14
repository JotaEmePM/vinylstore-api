import { Injectable } from '@nestjs/common'
import { sendEmail } from 'src/common/utils/email'
import { config } from '../config/configuration'
import { EmailLogService } from './emaillog.service'
import { WelcomeSubject, WelcomeTemplate } from './templates/welcome.email'
@Injectable()
export class EmailService {
	constructor(private readonly emailLogServices: EmailLogService) {
		console.log('EmailLogService')
	}

	async sendTest(content: string, from: string, to: string) {
		sendEmail(to, from, 'testr', content)
	}

	sendWelcomeTest = async (
		to: string,
		name: string,
		emailVerificationCode: string,
	) => {
		const appName = config.app.name
		const from = config.email.info_from
		const urlEmailVerification = `${config.email.url_email_verification}`
		const urlUnsub = `${config.email.url_email_unsub}${to}`

		const subject = WelcomeSubject(appName)
		const email = WelcomeTemplate(
			appName,
			name,
			urlEmailVerification,
			emailVerificationCode,
			urlUnsub,
		)

		const responseSendEmail = await sendEmail(to, from, subject, email)
		console.log(`resendId:${responseSendEmail}`)
		await this.emailLogServices.createLogEmail({
			from: config.email.info_from,
			reason: 'welcome',
			resendId: responseSendEmail,
			subject,
			to,
		})
	}
}
