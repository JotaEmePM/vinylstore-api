import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
	@Prop()
	name: string

	@Prop()
	enabled: boolean

	@Prop()
	roles: string[]

	@Prop()
	email: UserEmail[]

	@Prop()
	password: UserPassword[]

	@Prop()
	creationDate: Date
}

export class UserEmail {
	@Prop()
	email: string

	@Prop()
	hash: string

	@Prop()
	confirmed: boolean

	@Prop()
	creationDate: Date

	@Prop()
	endDate: Date | null
}

export class UserPassword {
	@Prop()
	hash: string

	@Prop()
	salt: string

	@Prop()
	creationDate: Date

	@Prop()
	endDate: Date | null

	@Prop()
	validationCode: string
}

export const UserSchema = SchemaFactory.createForClass(User)
