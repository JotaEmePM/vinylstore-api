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
}

export class UserEmail {
  @Prop()
  email: string

  @Prop()
  hash: string

  @Prop()
  confirmed: boolean

  @Prop()
  date: Date
}

export class UserPassword {
  @Prop()
  password: string

  @Prop()
  hash: string

  @Prop()
  salt: string

  @Prop()
  date: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
