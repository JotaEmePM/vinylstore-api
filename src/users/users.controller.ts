import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
} from '@nestjs/common'
import { User } from './schemas/user.schema'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SelectUserDto } from './dto/select-user.dto'

@ApiTags('users')
@Controller('/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/all')
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

	@Get()
	@ApiOperation({ summary: 'Get user by email' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully found.',
		type: User,
	})
	async findByEmail(@Query() params: { email: string }) {
		return this.usersService.findByEmail(params.email)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by id' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully found.',
		type: User,
	})
	async findById(@Param('id') id: string) {
		return this.usersService.findOne(id)
	}
}
