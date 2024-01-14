import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EmailLogService } from './emaillog.service'
import { EmailLogSchema } from './schemas/email.schemas'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'EmailLog',
				schema: EmailLogSchema,
			},
		]),
	],
	providers: [EmailLogService],
	controllers: [],
})
// eslint-disable-next-line prettier/prettier
export class EmailLogModule { }
