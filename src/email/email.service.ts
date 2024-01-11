import { Injectable } from '@nestjs/common'
import { sendTestEmail } from 'src/common/utils/email'

@Injectable()
export class EmailService {
	async sendTest(content: string, from: string, to: string) {
		sendTestEmail(to, from, 'testr', content)
	}
}
