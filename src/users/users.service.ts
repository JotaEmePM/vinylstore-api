import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schemas/user.schema'

import { Model } from 'mongoose'
import { generateUUID, hashPassword } from 'src/common/security'
import { CreateUserDto } from './dto/create-user.dto'
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

		// TODO: enviar email de confirmación de email.

		return createdUser.save()
	}

	async findAll(): Promise<SelectUserDto[]> {
		const users = await this.userModel.find().exec()

		if (!users) {
			return []
		}

		const usersModel = GetUserPublicData(users)
		return usersModel
	}

	async delete(id: string) {
		this.userModel.deleteOne({ _id: id }).exec()
	}

	async findOne(id: string): Promise<SelectUserDto> {
		try {
			const user = await this.userModel.findById(id).exec()

			if (!user) {
				return null
			}

			const userPublic = GetUserPublicData([user])
			return userPublic[0]
		} catch (err) {
			return null
		}
	}

	async findByEmail(email: string): Promise<SelectUserDto> {
		console.log('email', email)
		const user = await this.userModel.findOne({ 'email.email': email }).exec()

		if (!user) {
			return null
		}
		const userPublic = GetUserPublicData([user])
		return userPublic[0]
	}

	async findByUserName(name: string): Promise<SelectUserDto> {
		console.log('name', name)
		const user = await this.userModel.findOne({ name }).exec()
		if (!user) {
			return null
		}
		const userPublic = GetUserPublicData([user])
		return userPublic[0]
	}

	async changeEmail(userId: string, newEmail: string): Promise<boolean> {
		try {
			const user = await this.userModel.findById(userId).exec()
			if (!user) {
				return false
			}

			const email = user.email.find((email) => email.email === newEmail)
			if (email) {
				return false
			}

			const lastEmail = user.email
				.filter((email) => email.confirmed === true && email.endDate === null)
				.map((emailToCheck) => ({
					...emailToCheck,
					endDate: new Date(),
				}))
			if (!lastEmail) {
				return false
			}

			const newEmailUpdate = {
				email: newEmail.toLowerCase(),
				confirmed: false,
				creationDate: new Date(),
				endDate: null,
				hash: generateUUID(),
			}

			user.email = lastEmail
			user.email.push(newEmailUpdate)

			user.save()
			// TODO: enviar email de confirmación de email.

			return true
		} catch (error) {
			console.log(error)
			return false
		}
	}

	async confirmEmail(userId: string, hash: string): Promise<boolean> {
		try {
			const user = await this.userModel.findById(userId).exec()

			if (!user) {
				return false
			}

			const email = user.email.find((email) => email.hash === hash)
			if (!email) {
				return false
			}

			const otherMails = user.email.filter((email) => email.hash !== hash)
			email.confirmed = true

			user.email = otherMails
			user.email.push(email)

			await user.save()
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	}

	// TODO: Pendiente
	// async changePassword(

	async AddRole(userId: string, role: string): Promise<boolean> {
		const user = await this.userModel.findById(userId).exec()
		if (!user) {
			return false
		}

		const roles = user.roles.find((roleToCheck) => roleToCheck === role)
		if (roles) {
			return false
		}

		user.roles.push(role)
		user.save()
		return true
	}

	async RemoveRole(userId: string, role: string): Promise<boolean> {
		const user = await this.userModel.findById(userId).exec()
		if (!user) {
			return false
		}

		const roles = user.roles.find((roleToCheck) => roleToCheck === role)
		if (!roles) {
			return false
		}

		user.roles = user.roles.filter((roleToCheck) => roleToCheck !== role)
		user.save
		return true
	}

	async DisableUser(userId: string): Promise<boolean> {
		const user = await this.userModel.findById(userId).exec()
		if (!user) {
			return false
		}

		user.enabled = false
		user.save()
		return true
	}

	async EnableUser(userId: string): Promise<boolean> {
		const user = await this.userModel.findById(userId).exec()
		if (!user) {
			return false
		}

		user.enabled = true
		user.save()
		return true
	}

	// async changePassword(
	// 	userId: string,
	// 	oldPassword: string,
	// 	newPassword: string,
	// ): Promise<boolean> {
	// 	const user = await this.userModel.findById(userId).exec()
	// 	if (!user) {
	// 		return false
	// 	}

	// 	const password = user.password.find((password) => password.endDate === null)
	// 	if (!password) {
	// 		return false
	// 	}

	// 	if (!password.hash) {
	// 		return false
	// 	}

	// 	if (!password.salt) {
	// 		return false
	// 	}

	// 	// Check old password
	// 	const oldPasswordHash = hashPasswordWithSalt(oldPassword, password.salt)
	// 	if (oldPasswordHash.hashedPassword !== password.hash) {
	// 		return false
	// 	}

	// 	const { salt, hashedPassword } = hashPassword(newPassword)
	// 	password.endDate = new Date()

	// 	const newPasswordUpdate = {
	// 		password: hashedPassword,
	// 		salt,
	// 		creationDate: new Date(),
	// 		endDate: null,
	// 	}

	// 	user.password.push(newPasswordUpdate as UserPassword)
	// 	user.save()
	// 	return true
	// }
}

function GetUserPublicData(users: UserDocument[]) {
	return users.map((user) => {
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
}
