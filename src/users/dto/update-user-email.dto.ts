export class UpdateUserEmailDto {
	name: string
	enabled: boolean
	roles: string[]
	email: UserEmail[]
	password: UserPassword[]
	creationDate: Date
}

class UserEmail {
	email: string
	hash: string
	confirmed: boolean
	creationDate: Date
	endDate: Date | null
}

class UserPassword {
	hash: string
	salt: string
	creationDate: Date
	endDate: Date | null
}
