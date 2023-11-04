import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schemas/user.schema'

import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { generateUUID, hashPassword } from 'src/common/security'
import { SelectUserDto } from './dto/select-user.dto'

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<User>) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const { salt, hashedPassword } = hashPassword(createUserDto.password)

		const createdUser = new this.userModel({
			name: createUserDto.name,
			enabled: true,
			roles: ['user'],
			email: [
				{
					email: createUserDto.email,
					confirmed: false,
					creationDate: new Date(),
					endDate: null,
					hash: generateUUID(),
				},
			],
			password: [
				{
					password: hashedPassword,
					date: new Date(),
					salt,
					creationDate: new Date(),
					endDate: null,
				},
			],
		})
		return createdUser.save()
	}

	async findAll(): Promise<SelectUserDto[]> {
		const users = await this.userModel.find().exec()

		const usersModel = users.map((user) => {
			const lastEmail = user.email.find(
				(email) => email.confirmed === true && email.endDate === null,
			)
			return {
				uid: user._id.toString(),
				name: user.name,
				enabled: user.enabled,
				roles: user.roles,
				email: lastEmail?.email,
				creationDate: user.creationDate,
			} as SelectUserDto
		})
		return usersModel
		// const usersModel =  users.map((user) => {
		// 	const lastEmail = user.email.find((email) => email.confirmed && email.endDate === null))

		// 	({
		// 		name: user.name,
		// 		enabled: user.enabled,
		// 		roles: user.roles,
		// 		email: lastEmail.email,
		// 		creationDate: user.creationDate,
		// 	})

		// })

		// return usersModel as SelectUserDto[]
	}

	async delete(id: string) {
		this.userModel.deleteOne({ _id: id }).exec()
	}

	async findOne(id: string): Promise<User> {
		return this.userModel.findById(id).exec()
	}

	async findByEmail(email: string): Promise<User> {
		return await this.userModel.findOne({ 'email.email': email }).exec()
	}

	async findByUserName(name: string): Promise<User> {
		return await this.userModel.findOne({ name: name }).exec()
	}
}
