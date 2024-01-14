import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateEmailLogDTO } from './dto/create-email-log.dto'
import { EmailLog } from './schemas/email.schemas'

@Injectable()
export class EmailLogService {
	constructor(
		@InjectModel(EmailLog.name) private email_logModel: Model<EmailLog>,
	) {
		console.log('EmailLogService started')
	}

	async createLogEmail(newLog: CreateEmailLogDTO) {
		const newLogEmail = new this.email_logModel({
			to: newLog.to,
			from: newLog.from,
			reason: newLog.reason,
			resendId: newLog.resendId,
			subject: newLog.subject,
			creationDate: new Date(),
		})

		await newLogEmail.save()
	}
}
