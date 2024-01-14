import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import DefaultResponseDTO from 'src/common/dto/default-response.dto'
import { RoleAvailable } from 'src/common/role/role.list'
import { EmailService } from 'src/email/email.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './schemas/user.schema'
import UsersConstants from './users.constants'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('/users')
export class UsersController {
	userConstants = new UsersConstants()

	// eslint-disable-next-line prettier/prettier
	constructor(
		private readonly usersService: UsersService,
		private readonly emailService: EmailService,
	) {
		console.log('')
	}

	@Get('/')
	@ApiOperation({
		description: 'List all active users',
	})
	async findAll(): Promise<DefaultResponseDTO> {
		return await this.usersService.findAll()
	}

	@Post()
	@ApiOperation({ summary: 'Create user' })
	@ApiResponse({
		status: 201,
		description: 'The user has been successfully created.',
		type: User,
	})
	async create(
		@Body() createUserDto: CreateUserDto,
	): Promise<DefaultResponseDTO> {
		const { name, email, password } = createUserDto

		if (!name || !email || !password) {
			return {
				IsError: false,
				HttpCode: 201,
				Message: this.userConstants.ErrorMessages.FN_CREATE_VALIDATIONERROR,
				Location: this.userConstants.functions.FN_CREATE,
				Value: {},
			} as DefaultResponseDTO
		}

		const existingUser = await this.usersService.findByEmail(email)
		if (!existingUser.IsError) {
			return {
				IsError: false,
				HttpCode: 201,
				Message: this.userConstants.ErrorMessages.FN_CREATE_EMAILEXIST,
				Location: this.userConstants.functions.FN_CREATE,
				Value: {},
			} as DefaultResponseDTO
		}

		const existingName = await this.usersService.findByUserName(name)
		if (!existingName.IsError) {
			return {
				IsError: false,
				HttpCode: 201,
				Message: this.userConstants.ErrorMessages.FN_CREATE_USERNAMEEXIST,
				Location: this.userConstants.functions.FN_CREATE,
				Value: {},
			} as DefaultResponseDTO
		}

		const responseUserCreation = await this.usersService.create(createUserDto)

		if (!responseUserCreation.IsError) {
			const user = responseUserCreation.Value

			await this.emailService.sendWelcomeTest(email, name, user!.email[0].hash)
		}
		return responseUserCreation
	}

	@ApiOperation({ summary: 'Delete user' })
	@ApiResponse({
		status: 204,
		description: 'The user has been successfully deleted.',
	})
	@Delete(':id')
	async delete(@Param('id') id: string) {
		const user = await this.usersService.findOne(id)
		if (user.IsError) return user

		return await this.usersService.delete(id)
	}

	@Get('/email')
	@ApiOperation({ summary: 'Get user by email' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully found.',
		type: User,
	})
	async findByEmail(@Query() params: { email: string }) {
		const user = await this.usersService.findByEmail(params.email)
		if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		return user
	}

	@Get('/name')
	@ApiOperation({ summary: 'Get user by username' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully found.',
		type: User,
	})
	async findByName(@Query() params: { name: string }) {
		const user = await this.usersService.findByUserName(params.name)
		if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		return user
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by id' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully found.',
		type: User,
	})
	async findById(@Param('id') id: string) {
		const user = await this.usersService.findOne(id)
		if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		return user
	}

	@Put('/confirmemail')
	@ApiOperation({ summary: 'Confirm user email' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully confirmed.',
		type: User,
	})
	async confirmEmail(@Body() params: { uid: string; hash: string }) {
		return await this.usersService.confirmEmail(params.uid, params.hash)
	}

	@Put('/changeemail')
	@ApiOperation({ summary: 'Change user email' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully changed.',
		type: User,
	})
	async changeEmail(@Body() params: { uid: string; newEmail: string }) {
		return await this.usersService.changeEmail(params.uid, params.newEmail)
	}

	@Put('/addrole')
	@ApiOperation({ summary: 'Add role to user' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully changed.',
		type: User,
	})
	async addRole(@Body() params: { uid: string; role: string }) {
		if (params.role.length === 0)
			throw new HttpException('Role not found', HttpStatus.NOT_FOUND)

		if (!Object.values(RoleAvailable).includes(params.role as RoleAvailable)) {
			throw new HttpException('Role not found', HttpStatus.NOT_FOUND)
		}

		return await this.usersService.addRole(params.uid, params.role)
	}

	@Put('/removerole')
	@ApiOperation({ summary: 'Remove role to user' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully changed.',
		type: User,
	})
	async RemoveRole(@Body() params: { uid: string; role: string }) {
		if (params.role.length === 0)
			throw new HttpException('Role not found', HttpStatus.NOT_FOUND)

		if (!Object.values(RoleAvailable).includes(params.role as RoleAvailable)) {
			throw new HttpException('Role not found', HttpStatus.NOT_FOUND)
		}

		return await this.usersService.RemoveRole(params.uid, params.role)
	}

	@Put('/changepassword')
	@ApiOperation({ summary: 'Change user password' })
	@ApiResponse({
		status: 200,
		description: 'The user password  has been successfully changed.',
		type: User,
	})
	async changePassword(
		@Body() params: { uid: string; oldPassword: string; newPassword: string },
	) {
		return await this.usersService.changePassword(
			params.uid,
			params.oldPassword,
			params.newPassword,
		)
	}
}
