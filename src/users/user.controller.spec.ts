import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

describe('UsersController', () => {
	let usersController: UsersController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [UsersService],
		}).compile()

		usersController = app.get<UsersController>(UsersController)
	})

	describe('Get All users', () => {
		it('should return an array of users', async () => {
			const users = await usersController.findAll()
			expect(Array.isArray(users)).toBe(true)
		})
	})
})
