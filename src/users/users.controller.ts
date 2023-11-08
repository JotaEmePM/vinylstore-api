import {
	BadRequestException,
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
import { User } from './schemas/user.schema'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SelectUserDto } from './dto/select-user.dto'
import { RoleAvailable } from 'src/common/role/role.list'

@ApiTags('users')
@Controller('/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/')
	@ApiOperation({ summary: 'Get all users' })
	async findAll(): Promise<SelectUserDto[]> {
		return this.usersService.findAll()
	}

	@Post()
	@ApiOperation({ summary: 'Create user' })
	@ApiResponse({
		status: 201,
		description: 'The user has been successfully created.',
		type: User,
	})
	async create(@Body() createUserDto: CreateUserDto) {
		const { name, email, password } = createUserDto

		if (!email || !password) {
			throw new BadRequestException('Email and password are required')
		}

		const existingUser = await this.usersService.findByEmail(email)
		if (existingUser) {
			throw new BadRequestException('Email already in use')
		}

		const existingName = await this.usersService.findByUserName(name)
		if (existingName) {
			throw new BadRequestException('Username already in use')
		}

		await this.usersService.create(createUserDto)
	}

	@ApiOperation({ summary: 'Delete user' })
	@ApiResponse({
		status: 204,
		description: 'The user has been successfully deleted.',
	})
	@Delete(':id')
	async delete(@Param('id') id: string) {
		const user = this.usersService.findOne(id)
		if (!user) throw new Error('User not found')

		return this.usersService.delete(id)
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
		const user = await this.usersService.findOne(params.uid)

		if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

		return await this.usersService.confirmEmail(user.uid, params.hash)
	}

	@Put('/changeemail')
	@ApiOperation({ summary: 'Change user email' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully changed.',
		type: User,
	})
	async changeEmail(@Body() params: { uid: string; newEmail: string }) {
		const user = await this.usersService.findOne(params.uid)

		if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

		return await this.usersService.changeEmail(user.uid, params.newEmail)
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

		const user = await this.usersService.findOne(params.uid)

		if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

		return await this.usersService.AddRole(user.uid, params.role)
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

		const user = await this.usersService.findOne(params.uid)

		if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

		return await this.usersService.RemoveRole(user.uid, params.role)
	}

	// TODO: Change password
	// @Put('/changepassword')
	// @ApiOperation({ summary: 'Change user password' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'The user password  has been successfully changed.',
	// 	type: User,
	// })
	// async changePassword(
	// 	@Body() params: { uid: string; oldPassword: string; newPassword: string },
	// ) {
	// 	const user = await this.usersService.findOne(params.uid)

	// 	if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

	// 	return await this.usersService.changePassword(user.uid, params.oldPassword, params.newPassword)
	// }
}
