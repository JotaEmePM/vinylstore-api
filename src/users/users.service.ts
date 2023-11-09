import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schemas/user.schema'

import { Model } from 'mongoose'
import { generateUUID, hashPassword, verifyPassword } from 'src/common/security'
import { CreateUserDto } from './dto/create-user.dto'
import { SelectUserDto } from './dto/select-user.dto'
import DefaultResponseDTO from 'src/common/dto/default-response.dto'
import UsersConstants from './users.constants'

@Injectable()
export class UsersService {
	userConstants = new UsersConstants()

	constructor(@InjectModel(User.name) private userModel: Model<User>) {}

	async create(createUserDto: CreateUserDto): Promise<DefaultResponseDTO> {
		try {
			const { salt, hashedPassword } = hashPassword(createUserDto.password)

			// TODO: Validar DTO.
			// Tipo de datos.
			// Usuario o email no exista.
			// Requerimientos de password.

			const createdUser = new this.userModel({
				name: createUserDto.name,
				enabled: true,
				roles: [this.userConstants.userRoles.USER_ROLE],
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
						validationCode: generateUUID(),
					},
				],
			})

			// TODO: enviar email de confirmación de email.

			return {
				IsError: false,
				HttpCode: 201,
				Message: this.userConstants.SuccessMessages.FN_CREATE_OK,
				Location: this.userConstants.functions.FN_CREATE,
				Value: createdUser.save(),
			} as DefaultResponseDTO
		} catch (err) {
			if (err && err instanceof Error)
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_CREATE_ERROR,
					Value: err.message,
					Location: this.userConstants.functions.FN_CREATE,
				} as DefaultResponseDTO
		}
	}

	async findAll(): Promise<DefaultResponseDTO> {
		try {
			const users = await this.userModel.find().exec()

			if (!users) {
				return {
					IsError: false,
					HttpCode: 201,
					Message: this.userConstants.SuccessMessages.FN_FINDALL_OK,
					Location: this.userConstants.functions.FN_FINDALL,
					Value: [],
				} as DefaultResponseDTO
			}

			return {
				IsError: false,
				HttpCode: 201,
				Message: this.userConstants.SuccessMessages.FN_FINDALL_OK,
				Location: this.userConstants.functions.FN_FINDALL,
				Value: GetUserPublicData(users),
			} as DefaultResponseDTO
		} catch (err) {
			if (err && err instanceof Error)
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_FINDALL_ERROR,
					Value: err.message,
					Location: this.userConstants.functions.FN_FINDALL,
				} as DefaultResponseDTO
		}
	}

	async delete(id: string): Promise<DefaultResponseDTO> {
		try {
			// TODO: cambiar función por deshabilitar usuario.
			this.userModel.deleteOne({ _id: id }).exec()
			return {
				IsError: false,
				HttpCode: 201,
				Message: this.userConstants.SuccessMessages.FN_DELETE_OK,
				Location: this.userConstants.functions.FN_DELETE,
			} as DefaultResponseDTO
		} catch (err) {
			if (err && err instanceof Error)
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_DELETE_ERROR,
					Value: err.message,
					Location: this.userConstants.functions.FN_DELETE,
				} as DefaultResponseDTO
		}
	}

	async findOne(id: string): Promise<DefaultResponseDTO> {
		try {
			const user = await this.userModel.findById(id).exec()

			if (!user) {
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_FINDONE_ERROR,
					Value: this.userConstants.ErrorMessages.FN_FINDONE_USERNOTEXIST,
					Location: this.userConstants.functions.FN_FINDONE,
				} as DefaultResponseDTO
			}

			const userPublic = GetUserPublicData([user])
			return {
				IsError: false,
				HttpCode: 200,
				Message: this.userConstants.SuccessMessages.FN_FINDONE_OK,
				Value: userPublic,
				Location: this.userConstants.functions.FN_FINDONE,
			} as DefaultResponseDTO
		} catch (err) {
			if (err && err instanceof Error)
				return {
					IsError: true,
					HttpCode: 500,
					Message: err.message,
					Location: this.userConstants.functions.FN_FINDONE,
				} as DefaultResponseDTO
		}
	}

	async findByEmail(email: string): Promise<DefaultResponseDTO> {
		try {
			const user = await this.userModel.findOne({ 'email.email': email }).exec()

			if (!user) {
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_FINDBYEMAIL_USERNOTEXIST,
					Location: this.userConstants.functions.FN_FINDBYEMAIL,
				} as DefaultResponseDTO
			}

			return {
				IsError: false,
				HttpCode: 200,
				Message: this.userConstants.SuccessMessages.FN_FINDBYEMAIL_OK,
				Location: this.userConstants.functions.FN_FINDBYEMAIL,
				Value: GetUserPublicData([user])[0],
			} as DefaultResponseDTO
		} catch (err) {
			if (err && err instanceof Error)
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_FINDBYEMAIL_ERROR,
					Value: err,
					Location: this.userConstants.functions.FN_FINDBYEMAIL,
				} as DefaultResponseDTO
		}
	}

	async findByUserName(name: string): Promise<DefaultResponseDTO> {
		try {
			const user = await this.userModel.findOne({ name }).exec()
			if (!user) {
				return {
					IsError: true,
					HttpCode: 500,
					Message:
						this.userConstants.ErrorMessages.FN_FINDBYUSERNAME_USERNOTEXIST,
					Location: this.userConstants.functions.FN_FINDBYUSERNAME,
				} as DefaultResponseDTO
			}

			return {
				IsError: false,
				HttpCode: 200,
				Message: this.userConstants.SuccessMessages.FN_FINDBYUSERNAME_OK,
				Location: this.userConstants.functions.FN_FINDBYUSERNAME,
				Value: GetUserPublicData([user])[0],
			} as DefaultResponseDTO
		} catch (err) {
			if (err && err instanceof Error)
				return {
					IsError: true,
					HttpCode: 500,
					Message: err.message,
					Location: this.userConstants.functions.FN_FINDBYUSERNAME,
				} as DefaultResponseDTO
		}
	}

	async changeEmail(
		userId: string,
		newEmail: string,
	): Promise<DefaultResponseDTO> {
		try {
			const user = await this.userModel.findById(userId).exec()
			if (!user) {
				return {
					IsError: true,
					HttpCode: 500,
					Message:
						this.userConstants.ErrorMessages.FN_CHANGEEMAILL_USERNOTEXIST,
					Location: this.userConstants.functions.FN_CHANGEEMAIL,
				} as DefaultResponseDTO
			}

			const email = user.email.find(
				(email) => email.email === newEmail && email.endDate === null,
			)
			if (email) {
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_CHANGEEMAILL_EMAILEXIST,
					Location: this.userConstants.functions.FN_CHANGEEMAIL,
				} as DefaultResponseDTO
			}

			const lastEmail = user.email
				.filter((email) => email.confirmed === true && email.endDate === null)
				.map((emailToCheck) => ({
					...emailToCheck,
					endDate: new Date(),
				}))
			if (!lastEmail) {
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_CHANGEEMAILL_EMAILEXIST,
					Location: this.userConstants.functions.FN_CHANGEEMAIL,
				} as DefaultResponseDTO
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

			return {
				IsError: false,
				HttpCode: 200,
				Message: this.userConstants.SuccessMessages.FN_CHANGEEMAIL_OK,
				Value: true,
				Location: this.userConstants.functions.FN_CHANGEEMAIL,
			} as DefaultResponseDTO
		} catch (err) {
			if (err && err instanceof Error)
				return {
					IsError: true,
					HttpCode: 500,
					Message: err.message,
					Location: this.userConstants.functions.FN_CHANGEEMAIL,
				} as DefaultResponseDTO
		}
	}

	async confirmEmail(
		userId: string,
		hash: string,
	): Promise<DefaultResponseDTO> {
		try {
			const user = await this.userModel.findById(userId).exec()

			if (!user) {
				return {
					IsError: true,
					HttpCode: 500,
					Message:
						this.userConstants.ErrorMessages.FN_CONFIRMEMAIL_USERNOTEXIST,
					Location: this.userConstants.functions.FN_CONFIRMEMAIL,
				} as DefaultResponseDTO
			}

			const email = user.email.find((email) => email.hash === hash)
			if (!email) {
				return {
					IsError: true,
					HttpCode: 500,
					Message:
						this.userConstants.ErrorMessages.FN_CONFIRMEMAIL_EMAILNOTEXIST,
					Location: this.userConstants.functions.FN_CONFIRMEMAIL,
				} as DefaultResponseDTO
			}

			const otherMails = user.email.filter((email) => email.hash !== hash)
			email.confirmed = true

			user.email = otherMails
			user.email.push(email)

			await user.save()
			return {
				IsError: false,
				HttpCode: 200,
				Message: this.userConstants.SuccessMessages.FN_CONFIRMEMAIL_OK,
				Location: this.userConstants.functions.FN_CONFIRMEMAIL,
				Value: true,
			} as DefaultResponseDTO
		} catch (err) {
			if (err && err instanceof Error)
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_CONFIRMEMAIL_ERROR,
					Value: err,
					Location: this.userConstants.functions.FN_CONFIRMEMAIL,
				} as DefaultResponseDTO
		}
	}

	// TODO: Pendiente
	// async changePassword(

	async addRole(userId: string, role: string): Promise<DefaultResponseDTO> {
		try {
			const user = await this.userModel.findById(userId).exec()
			if (!user) {
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_ADDROLE_USERNOTEXIST,
					Location: this.userConstants.functions.FN_ADDROLE,
				} as DefaultResponseDTO
			}

			const roles = user.roles.find((roleToCheck) => roleToCheck === role)
			if (roles) {
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_ADDROLE_USERROLEPRESENT,
					Location: this.userConstants.functions.FN_ADDROLE,
				} as DefaultResponseDTO
			}

			user.roles.push(role)
			user.save()
			return {
				IsError: false,
				HttpCode: 200,
				Message: this.userConstants.SuccessMessages.FN_ADDROLE_OK,
				Location: this.userConstants.functions.FN_ADDROLE,
			} as DefaultResponseDTO
		} catch (err) {
			if (err && err instanceof Error)
				return {
					IsError: true,
					HttpCode: 500,
					Message: this.userConstants.ErrorMessages.FN_ADDROLE_ERROR,
					Value: err,
					Location: this.userConstants.functions.FN_ADDROLE,
				} as DefaultResponseDTO
		}
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

	async changePassword(
		userId: string,
		oldPassword: string,
		newPassword: string,
	): Promise<DefaultResponseDTO> {
		const user = await this.userModel.findById(userId).exec()
		if (!user)
			return {
				HttpCode: 0,
				IsError: true,
				Message: 'Usuario no encontrado',
				Value: null,
				Location: 'PENDING',
			}

		const password = user.password.find((password) => password.endDate === null)
		if (!password)
			return {
				HttpCode: 500,
				IsError: true,
				Message: 'Error Password ',
				Value: null,
				Location: 'PENDING',
			}

		const oldPasswordCheck = verifyPassword(
			oldPassword,
			password.hash,
			password.salt,
		)
		console.log(oldPasswordCheck)
		if (!oldPasswordCheck)
			return {
				HttpCode: 0,
				IsError: true,
				Message: 'Contraseña no valida',
				Value: null,
				Location: 'PENDING',
			}

		const { salt, hashedPassword } = hashPassword(newPassword)

		user.password = []
		user.password.map((p) => {
			if (p.endDate === null) p.endDate = new Date()
		})
		user.password.push({
			hash: hashedPassword,
			salt,
			creationDate: new Date(),
			endDate: null,
			validationCode: generateUUID(),
		})

		user.save()
		return {
			HttpCode: 200,
			IsError: false,
			Message: 'Nueva contraseña almacenada',
			Value: null,
			Location: 'PENDING',
		}
	}
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
