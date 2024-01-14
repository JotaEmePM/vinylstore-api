import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EmailService } from 'src/email/email.service'
import { EmailLogService } from 'src/email/emaillog.service'
import { EmailLogSchema } from 'src/email/schemas/email.schemas'
import { UserSchema } from './schemas/user.schema'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'User',
				schema: UserSchema,
			},
			{
				name: 'EmailLog',
				schema: EmailLogSchema,
			},
		]),
	],
	providers: [UsersService, EmailService, EmailLogService],
	controllers: [UsersController],
})

// eslint-disable-next-line prettier/prettier
export class UsersModule { }
