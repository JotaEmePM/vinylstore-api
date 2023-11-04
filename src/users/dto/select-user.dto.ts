export interface SelectUserDto {
	uid: string
	name: string
	enabled: boolean
	roles: string[]
	email: string
	creationDate: Date
}
