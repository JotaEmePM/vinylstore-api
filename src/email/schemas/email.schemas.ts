import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema()
export class EmailLog {
	@Prop()
	from: string

	@Prop()
	to: string

	@Prop()
	subject: string

	@Prop()
	reason: string

	@Prop()
	resendId: string

	@Prop()
	creationDate: Date
}

export type EmailLogDocument = HydratedDocument<EmailLog>
export const EmailLogSchema = SchemaFactory.createForClass(EmailLog)
